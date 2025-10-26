'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Zap, FileText, Share2, Image, Video } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Content Catalyst AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Videos Into
            <span className="text-primary-600"> Complete Content Campaigns</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Turn one long-form video into blog posts, social media content, short clips,
            and quote graphics with the power of AI. Save hours of manual work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
              Start Creating Content
            </Link>
            <button className="btn-secondary text-lg px-8 py-3 flex items-center justify-center">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI analyzes your video content and generates a complete content campaign package
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-primary-600" />}
            title="SEO-Optimized Blog Posts"
            description="Automatically generate well-structured blog posts from your video content, complete with headings and key takeaways."
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8 text-primary-600" />}
            title="Social Media Posts"
            description="Create engaging LinkedIn posts and tweets with relevant hashtags and compelling hooks."
          />
          <FeatureCard
            icon={<Video className="h-8 w-8 text-primary-600" />}
            title="Short-Form Video Clips"
            description="Extract the most impactful moments as vertical video clips perfect for TikTok, Reels, and Shorts."
          />
          <FeatureCard
            icon={<Image className="h-8 w-8 text-primary-600" />}
            title="Quote Graphics"
            description="Turn powerful quotes from your content into visually appealing graphics for social media."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary-600" />}
            title="AI-Powered Analysis"
            description="Advanced AI analyzes your video's audio, visuals, and speech to identify key moments and quotes."
          />
          <FeatureCard
            icon={<Play className="h-8 w-8 text-primary-600" />}
            title="One-Click Processing"
            description="Simply paste a YouTube URL and let our AI do all the heavy lifting while you focus on creating."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From video to complete content campaign in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              title="Submit Your Video"
              description="Paste a YouTube URL of your long-form content into our platform."
            />
            <StepCard
              step="2"
              title="AI Processing"
              description="Our AI analyzes the video, extracts key moments, quotes, and generates content."
            />
            <StepCard
              step="3"
              title="Download & Share"
              description="Get your complete content campaign package ready to publish across platforms."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join content creators who are saving hours of work with AI-powered content repurposing.
          </p>
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold">Content Catalyst AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 Content Catalyst AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ step, title, description }: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}