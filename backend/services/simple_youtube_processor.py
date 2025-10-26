"""
Simplified YouTube processor that works without external APIs
"""
import yt_dlp
import tempfile
import os
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class SimpleYouTubeProcessor:
    """Process YouTube videos and extract basic information"""
    
    async def process_video(self, video_url: str) -> Dict[str, Any]:
        """Extract video information and basic transcript if available"""
        try:
            # Configure yt-dlp options
            ydl_opts = {
                'writesubtitles': True,
                'writeautomaticsub': True,
                'subtitleslangs': ['en'],
                'skip_download': True,  # Don't download video, just get info
                'quiet': True,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extract video information
                info = ydl.extract_info(video_url, download=False)
                
                # Get basic video metadata
                result = {
                    'title': info.get('title', 'Unknown Title'),
                    'description': info.get('description', '')[:500] + '...' if info.get('description') else '',
                    'duration': info.get('duration', 0),
                    'thumbnail_url': info.get('thumbnail', ''),
                    'uploader': info.get('uploader', ''),
                    'view_count': info.get('view_count', 0),
                    'upload_date': info.get('upload_date', ''),
                }
                
                # Try to get subtitles/transcript
                transcript = await self._extract_transcript(info)
                result['transcript'] = transcript
                
                # Generate content based on available information
                result['key_moments'] = await self._identify_key_moments(transcript, result['duration'])
                result['key_quotes'] = await self._extract_key_quotes(transcript)
                
                return result
                
        except Exception as e:
            logger.error(f"YouTube processing failed: {str(e)}")
            # Return basic fallback data
            return {
                'title': 'Video Processing Failed',
                'description': 'Unable to process this video. Please try another URL.',
                'duration': 0,
                'thumbnail_url': '',
                'transcript': 'No transcript available.',
                'key_moments': [],
                'key_quotes': ['Unable to extract quotes from this video.']
            }
    
    async def _extract_transcript(self, video_info: Dict[str, Any]) -> str:
        """Extract transcript from video subtitles"""
        try:
            # Check if subtitles are available
            subtitles = video_info.get('subtitles', {})
            automatic_captions = video_info.get('automatic_captions', {})
            
            # Try to get English subtitles
            subtitle_data = None
            if 'en' in subtitles:
                subtitle_data = subtitles['en']
            elif 'en' in automatic_captions:
                subtitle_data = automatic_captions['en']
            
            if subtitle_data:
                # For now, return a placeholder since processing subtitles requires more complex parsing
                return f"Transcript extracted from: {video_info.get('title', 'video')}. Full transcript processing requires additional setup."
            
            # Fallback: use description as transcript
            description = video_info.get('description', '')
            if description:
                return description[:1000] + '...' if len(description) > 1000 else description
            
            return "No transcript or description available for this video."
            
        except Exception as e:
            logger.error(f"Transcript extraction failed: {str(e)}")
            return "Transcript extraction failed."
    
    async def _identify_key_moments(self, transcript: str, duration: int) -> list:
        """Identify key moments based on available information"""
        if not transcript or duration == 0:
            return []
        
        # Simple heuristic: create 3-5 moments based on video duration
        num_moments = min(5, max(3, duration // 300))  # One moment per 5 minutes, max 5
        moments = []
        
        for i in range(num_moments):
            start_time = (duration // num_moments) * i
            end_time = min(start_time + 60, duration)  # 60-second clips
            
            moments.append({
                'start_time': start_time,
                'end_time': end_time,
                'duration': end_time - start_time,
                'description': f'Key moment {i + 1}',
                'confidence': 0.7
            })
        
        return moments
    
    async def _extract_key_quotes(self, transcript: str) -> list:
        """Extract key quotes from transcript"""
        if not transcript or len(transcript) < 50:
            return ['No quotes available from this video.']
        
        # Simple quote extraction based on sentence structure
        sentences = transcript.replace('\n', ' ').split('. ')
        quotes = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            # Look for impactful sentences
            if (len(sentence.split()) >= 8 and len(sentence.split()) <= 25 and
                any(word in sentence.lower() for word in ['important', 'key', 'remember', 'crucial', 'must', 'should', 'always', 'never'])):
                quotes.append(sentence + '.')
                
            if len(quotes) >= 5:
                break
        
        # If no good quotes found, use first few sentences
        if not quotes:
            quotes = [s.strip() + '.' for s in sentences[:3] if len(s.strip()) > 20]
        
        return quotes[:5] if quotes else ['Key insights from this video content.']