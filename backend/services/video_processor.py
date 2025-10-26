import os
import yt_dlp
import tempfile
from typing import Dict, List, Any
from google.cloud import videointelligence
from moviepy.editor import VideoFileClip
import json
import logging

logger = logging.getLogger(__name__)

class VideoProcessor:
    def __init__(self):
        self.video_client = videointelligence.VideoIntelligenceServiceClient()
        self.storage_bucket = os.getenv("GOOGLE_CLOUD_STORAGE_BUCKET")

    async def analyze_video(self, video_url: str) -> Dict[str, Any]:
        """Download video and perform AI analysis"""
        try:
            # Download video
            video_info = await self._download_video(video_url)
            
            # Upload to cloud storage for processing
            gcs_uri = await self._upload_to_storage(video_info["file_path"])
            
            # Perform video intelligence analysis
            analysis_result = await self._analyze_with_video_intelligence(gcs_uri)
            
            # Process and structure the results
            processed_result = await self._process_analysis_results(
                analysis_result, 
                video_info
            )
            
            return processed_result
            
        except Exception as e:
            logger.error(f"Video analysis failed: {str(e)}")
            raise e

    async def _download_video(self, video_url: str) -> Dict[str, Any]:
        """Download video using yt-dlp"""
        try:
            # Create temporary directory
            temp_dir = tempfile.mkdtemp()
            
            ydl_opts = {
                'format': 'best[height<=720]',  # Limit quality for processing
                'outtmpl': f'{temp_dir}/%(title)s.%(ext)s',
                'writeinfojson': True,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extract info
                info = ydl.extract_info(video_url, download=False)
                
                # Download video
                ydl.download([video_url])
                
                # Get downloaded file path
                file_path = ydl.prepare_filename(info)
                
                return {
                    "file_path": file_path,
                    "title": info.get("title", ""),
                    "description": info.get("description", ""),
                    "duration": info.get("duration", 0),
                    "thumbnail": info.get("thumbnail", ""),
                    "uploader": info.get("uploader", ""),
                    "upload_date": info.get("upload_date", ""),
                }
                
        except Exception as e:
            logger.error(f"Video download failed: {str(e)}")
            raise e

    async def _upload_to_storage(self, file_path: str) -> str:
        """Upload video to Google Cloud Storage"""
        try:
            from google.cloud import storage
            
            client = storage.Client()
            bucket = client.bucket(self.storage_bucket)
            
            # Generate unique blob name
            import uuid
            blob_name = f"videos/{uuid.uuid4()}.mp4"
            blob = bucket.blob(blob_name)
            
            # Upload file
            blob.upload_from_filename(file_path)
            
            return f"gs://{self.storage_bucket}/{blob_name}"
            
        except Exception as e:
            logger.error(f"Storage upload failed: {str(e)}")
            raise e

    async def _analyze_with_video_intelligence(self, gcs_uri: str) -> Any:
        """Analyze video using Google Video Intelligence API"""
        try:
            features = [
                videointelligence.Feature.SPEECH_TRANSCRIPTION,
                videointelligence.Feature.SHOT_CHANGE_DETECTION,
                videointelligence.Feature.LABEL_DETECTION,
            ]
            
            config = videointelligence.SpeechTranscriptionConfig(
                language_code="en-US",
                enable_automatic_punctuation=True,
            )
            
            video_context = videointelligence.VideoContext(
                speech_transcription_config=config
            )
            
            operation = self.video_client.annotate_video(
                request={
                    "features": features,
                    "input_uri": gcs_uri,
                    "video_context": video_context,
                }
            )
            
            logger.info("Processing video analysis...")
            result = operation.result(timeout=1800)  # 30 minutes timeout
            
            return result
            
        except Exception as e:
            logger.error(f"Video Intelligence analysis failed: {str(e)}")
            raise e

    async def _process_analysis_results(
        self, 
        analysis_result: Any, 
        video_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process and structure the analysis results"""
        try:
            # Extract transcript
            transcript = ""
            speech_transcriptions = analysis_result.annotation_results[0].speech_transcriptions
            
            for transcription in speech_transcriptions:
                for alternative in transcription.alternatives:
                    transcript += alternative.transcript + " "
            
            # Extract shot changes
            shot_changes = []
            shot_annotations = analysis_result.annotation_results[0].shot_annotations
            
            for shot in shot_annotations:
                start_time = shot.start_time_offset.total_seconds()
                end_time = shot.end_time_offset.total_seconds()
                shot_changes.append({
                    "start_time": start_time,
                    "end_time": end_time,
                    "duration": end_time - start_time
                })
            
            # Extract labels
            labels = []
            label_annotations = analysis_result.annotation_results[0].label_annotations
            
            for label in label_annotations:
                labels.append({
                    "description": label.entity.description,
                    "confidence": label.segments[0].confidence if label.segments else 0
                })
            
            # Identify key moments (combine transcript timing with shot changes)
            key_moments = await self._identify_key_moments(
                speech_transcriptions, 
                shot_changes
            )
            
            # Extract key quotes
            key_quotes = await self._extract_key_quotes(transcript)
            
            return {
                "video_file_path": video_info["file_path"],
                "title": video_info["title"],
                "description": video_info["description"],
                "duration": video_info["duration"],
                "thumbnail_url": video_info["thumbnail"],
                "transcript": transcript.strip(),
                "key_moments": key_moments,
                "key_quotes": key_quotes,
                "labels": labels,
                "shot_changes": [s["start_time"] for s in shot_changes]
            }
            
        except Exception as e:
            logger.error(f"Analysis result processing failed: {str(e)}")
            raise e

    async def _identify_key_moments(
        self, 
        speech_transcriptions: List[Any], 
        shot_changes: List[Dict[str, float]]
    ) -> List[Dict[str, Any]]:
        """Identify key moments from transcript and shot changes"""
        try:
            key_moments = []
            
            # Simple heuristic: find segments with high word density and shot changes
            for i, shot in enumerate(shot_changes[:5]):  # Limit to 5 moments
                if shot["duration"] >= 15 and shot["duration"] <= 60:  # 15-60 second clips
                    key_moments.append({
                        "start_time": shot["start_time"],
                        "end_time": shot["end_time"],
                        "duration": shot["duration"],
                        "description": f"Key moment {i + 1}",
                        "confidence": 0.8
                    })
            
            return key_moments[:5]  # Return top 5 moments
            
        except Exception as e:
            logger.error(f"Key moment identification failed: {str(e)}")
            return []

    async def _extract_key_quotes(self, transcript: str) -> List[str]:
        """Extract key quotes from transcript"""
        try:
            # Simple extraction based on sentence structure
            sentences = transcript.split('. ')
            key_quotes = []
            
            for sentence in sentences:
                # Look for impactful sentences (questions, exclamations, key phrases)
                if (len(sentence.split()) >= 8 and len(sentence.split()) <= 25 and
                    ('?' in sentence or '!' in sentence or 
                     any(word in sentence.lower() for word in ['important', 'key', 'remember', 'crucial']))):
                    key_quotes.append(sentence.strip() + '.')
                    
                if len(key_quotes) >= 5:
                    break
            
            return key_quotes[:5]
            
        except Exception as e:
            logger.error(f"Quote extraction failed: {str(e)}")
            return []

    async def create_video_clip(
        self, 
        video_file_path: str, 
        start_time: float, 
        end_time: float, 
        clip_number: int
    ) -> str:
        """Create a short video clip from the original video"""
        try:
            # Load video
            video = VideoFileClip(video_file_path)
            
            # Extract clip
            clip = video.subclip(start_time, end_time)
            
            # Resize to vertical format (9:16)
            clip_resized = clip.resize(height=1920).crop(
                x_center=clip.w/2, 
                width=1080, 
                height=1920
            )
            
            # Generate output filename
            import uuid
            clip_filename = f"clip_{clip_number}_{uuid.uuid4().hex[:8]}.mp4"
            temp_dir = tempfile.mkdtemp()
            output_path = os.path.join(temp_dir, clip_filename)
            
            # Write clip
            clip_resized.write_videofile(
                output_path,
                codec='libx264',
                audio_codec='aac',
                temp_audiofile='temp-audio.m4a',
                remove_temp=True
            )
            
            # Upload to storage
            clip_url = await self._upload_clip_to_storage(output_path, clip_filename)
            
            # Cleanup
            video.close()
            clip.close()
            clip_resized.close()
            
            return clip_url
            
        except Exception as e:
            logger.error(f"Video clip creation failed: {str(e)}")
            raise e

    async def _upload_clip_to_storage(self, file_path: str, filename: str) -> str:
        """Upload video clip to storage"""
        try:
            from google.cloud import storage
            
            client = storage.Client()
            bucket = client.bucket(self.storage_bucket)
            
            blob_name = f"clips/{filename}"
            blob = bucket.blob(blob_name)
            
            blob.upload_from_filename(file_path)
            
            # Make blob publicly accessible
            blob.make_public()
            
            return blob.public_url
            
        except Exception as e:
            logger.error(f"Clip upload failed: {str(e)}")
            raise e