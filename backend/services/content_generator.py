import os
from typing import List, Dict, Any
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
import logging

logger = logging.getLogger(__name__)

class ContentGenerator:
    def __init__(self):
        endpoint = os.getenv("AZURE_AI_ENDPOINT")
        key = os.getenv("AZURE_AI_KEY")
        
        if not endpoint or not key:
            raise ValueError("Missing Azure AI configuration")
        
        self.text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(key)
        )

    async def generate_blog_post(
        self, 
        transcript: str, 
        title: str, 
        key_moments: List[Dict[str, Any]]
    ) -> str:
        """Generate a comprehensive blog post from video transcript"""
        try:
            # Use Azure AI for abstractive summarization
            summary_response = self.text_analytics_client.extract_summary(
                documents=[transcript],
                max_sentence_count=10
            )
            
            summary_sentences = []
            for result in summary_response:
                if not result.is_error:
                    summary_sentences.extend([sentence.text for sentence in result.sentences])
            
            # Structure the blog post
            blog_post = self._structure_blog_post(
                title=title,
                summary_sentences=summary_sentences,
                key_moments=key_moments,
                full_transcript=transcript
            )
            
            return blog_post
            
        except Exception as e:
            logger.error(f"Blog post generation failed: {str(e)}")
            # Fallback to simple summarization
            return self._generate_simple_blog_post(title, transcript, key_moments)

    def _structure_blog_post(
        self, 
        title: str, 
        summary_sentences: List[str], 
        key_moments: List[Dict[str, Any]], 
        full_transcript: str
    ) -> str:
        """Structure the blog post with proper formatting"""
        
        blog_post = f"""# {title}

## Overview

{' '.join(summary_sentences[:3])}

## Key Takeaways

"""
        
        # Add key moments as takeaways
        for i, moment in enumerate(key_moments[:5], 1):
            # Extract relevant text from transcript around the moment
            moment_text = self._extract_moment_text(full_transcript, moment)
            blog_post += f"### {i}. {moment.get('description', f'Key Point {i}')}\n\n"
            blog_post += f"{moment_text}\n\n"
        
        blog_post += """## Conclusion

"""
        blog_post += ' '.join(summary_sentences[-2:])
        
        return blog_post

    def _extract_moment_text(self, transcript: str, moment: Dict[str, Any]) -> str:
        """Extract relevant text for a key moment"""
        # Simple approximation - in a real implementation, you'd use timestamp alignment
        words = transcript.split()
        total_words = len(words)
        
        if total_words == 0:
            return "Key insight from the video content."
        
        # Estimate word position based on time
        start_ratio = moment.get('start_time', 0) / max(moment.get('duration', 1), 1)
        start_word = int(start_ratio * total_words)
        end_word = min(start_word + 50, total_words)  # ~50 words
        
        return ' '.join(words[start_word:end_word]) + "..."

    def _generate_simple_blog_post(
        self, 
        title: str, 
        transcript: str, 
        key_moments: List[Dict[str, Any]]
    ) -> str:
        """Fallback simple blog post generation"""
        
        # Simple extractive summarization
        sentences = transcript.split('. ')
        key_sentences = sentences[:5] if len(sentences) >= 5 else sentences
        
        blog_post = f"""# {title}

## Summary

{' '.join(key_sentences)}

## Key Points

"""
        
        for i, moment in enumerate(key_moments[:3], 1):
            blog_post += f"- **Point {i}**: {moment.get('description', 'Important insight from the content')}\n"
        
        blog_post += f"""

## Conclusion

This content provides valuable insights and actionable takeaways for viewers.
"""
        
        return blog_post

    async def generate_linkedin_posts(
        self, 
        transcript: str, 
        key_moments: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate LinkedIn posts from video content"""
        try:
            posts = []
            
            # Generate different types of LinkedIn posts
            posts.append(self._generate_insight_post(transcript, key_moments))
            posts.append(self._generate_question_post(transcript))
            posts.append(self._generate_tip_post(key_moments))
            
            return posts
            
        except Exception as e:
            logger.error(f"LinkedIn post generation failed: {str(e)}")
            return self._generate_fallback_linkedin_posts(transcript, key_moments)

    def _generate_insight_post(self, transcript: str, key_moments: List[Dict[str, Any]]) -> str:
        """Generate an insight-focused LinkedIn post"""
        
        # Extract first key insight
        first_moment = key_moments[0] if key_moments else {}
        insight_text = self._extract_moment_text(transcript, first_moment)[:200]
        
        post = f"""💡 Key insight from my latest content:

{insight_text}

This really resonated with me because it highlights the importance of [key concept].

What's your take on this? Share your thoughts below! 👇

#ContentCreation #Insights #Learning #Growth"""
        
        return post

    def _generate_question_post(self, transcript: str) -> str:
        """Generate a question-based LinkedIn post"""
        
        # Extract a question from transcript or create one
        sentences = transcript.split('. ')
        question_sentences = [s for s in sentences if '?' in s]
        
        if question_sentences:
            question = question_sentences[0] + '?'
        else:
            question = "What's the most important lesson you've learned recently?"
        
        post = f"""🤔 Here's a thought-provoking question:

{question}

I explored this in my recent content, and the answers might surprise you.

What would your answer be? Let's discuss in the comments!

#Discussion #Learning #Community #Growth"""
        
        return post

    def _generate_tip_post(self, key_moments: List[Dict[str, Any]]) -> str:
        """Generate a tip-focused LinkedIn post"""
        
        post = """🚀 Quick tips from my latest content:

"""
        
        for i, moment in enumerate(key_moments[:3], 1):
            tip = moment.get('description', f'Valuable tip #{i}')
            post += f"✅ {tip}\n"
        
        post += """
Which tip resonates most with you? 

Save this post for later and let me know your thoughts! 💭

#Tips #Productivity #Success #ContentCreation"""
        
        return post

    def _generate_fallback_linkedin_posts(
        self, 
        transcript: str, 
        key_moments: List[Dict[str, Any]]
    ) -> List[str]:
        """Fallback LinkedIn post generation"""
        
        posts = [
            f"""💡 Just shared some valuable insights in my latest content!

Key takeaway: {transcript[:150]}...

What's your experience with this? Share below! 👇

#Insights #Learning #Community""",
            
            f"""🎯 Three key points from my recent content:

1. {key_moments[0].get('description', 'First key point') if key_moments else 'Important insight'}
2. {key_moments[1].get('description', 'Second key point') if len(key_moments) > 1 else 'Valuable takeaway'}
3. {key_moments[2].get('description', 'Third key point') if len(key_moments) > 2 else 'Actionable tip'}

Which one hits home for you?

#Tips #Growth #Success""",
            
            """🤔 Question for my network:

What's the biggest challenge you're facing in your current projects?

I'd love to hear your thoughts and share some insights that might help!

#Community #Discussion #Help"""
        ]
        
        return posts

    async def generate_tweets(
        self, 
        transcript: str, 
        key_quotes: List[str]
    ) -> List[str]:
        """Generate tweets from video content"""
        try:
            tweets = []
            
            # Generate quote tweets
            for quote in key_quotes[:3]:
                if len(quote) <= 240:  # Twitter character limit
                    tweet = f'"{quote}"\n\n#Wisdom #Insights #Content'
                    tweets.append(tweet)
            
            # Generate insight tweets
            sentences = transcript.split('. ')
            for sentence in sentences[:2]:
                if len(sentence) <= 200:
                    tweet = f"💡 {sentence}\n\n#Tips #Learning"
                    tweets.append(tweet)
                    
            # Generate engagement tweets
            tweets.append(
                "🧵 Just dropped some valuable insights in my latest content.\n\n"
                "What's the most important lesson you've learned recently?\n\n"
                "#Thread #Learning #Community"
            )
            
            return tweets[:5]  # Return max 5 tweets
            
        except Exception as e:
            logger.error(f"Tweet generation failed: {str(e)}")
            return self._generate_fallback_tweets(key_quotes)

    def _generate_fallback_tweets(self, key_quotes: List[str]) -> List[str]:
        """Fallback tweet generation"""
        
        tweets = []
        
        # Use quotes if available
        for quote in key_quotes[:2]:
            if len(quote) <= 240:
                tweets.append(f'"{quote}"\n\n#Quotes #Wisdom')
        
        # Add generic tweets
        tweets.extend([
            "💡 Just shared some valuable insights in my latest content!\n\nWhat's your biggest takeaway? 👇\n\n#Content #Learning",
            "🎯 Key lesson: Always keep learning and growing.\n\nWhat's helping you grow right now?\n\n#Growth #Learning",
            "🤔 Question for you: What's the most important skill for success?\n\nShare your thoughts! 👇\n\n#Success #Skills"
        ])
        
        return tweets[:5]