'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, CheckCircle, Star, Users, Target, TrendingUp } from 'lucide-react';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <img
              src="/Beamx-Logo-Colour.png"
              alt="BeamX Solutions Logo"
              className="h-12 w-auto max-w-[200px]"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/questionnaire">
                <Button className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  Create Marketing Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Generate Your Complete <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Marketing Plan
              </span> <br />
              in Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Powered by Claude AI, our intelligent questionnaire creates a comprehensive marketing strategy 
              tailored specifically to your business. No marketing experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/questionnaire">
                <Button size="lg" className="px-8 py-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  Create Your Plan Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/sample-plans">
                <Button variant="outline" size="lg" className="px-8 py-4 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  View Sample Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-gray-500 mb-16 flex-wrap gap-4">
            <div className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>Powered by Claude AI</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
              <Users className="w-5 h-5" />
              <span>100+ Plans Created</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
              <Target className="w-5 h-5" />
              <span>9-Square Framework</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Marketing Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered system guides you through a proven framework to create 
              a complete marketing strategy that actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                Smart Questionnaire
              </h3>
              <p className="text-gray-600 mb-4">
                Our intelligent questionnaire adapts to your industry and business model, 
                ensuring you get the most relevant recommendations.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Industry-specific questions
                </li>
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  9-square marketing framework
                </li>
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Progress saving & resuming
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Claude AI analyzes your responses to identify opportunities, 
                competitive advantages, and create personalized strategies.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Advanced AI reasoning
                </li>
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Competitive analysis
                </li>
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Risk assessment
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
                Complete Implementation
              </h3>
              <p className="text-gray-600 mb-4">
                Get both a visual one-page plan and detailed implementation guide 
                with timelines, KPIs, and specific action steps.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  One-page visual plan
                </li>
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Detailed action steps
                </li>
                <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  PDF download & sharing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to your complete marketing plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                Answer Smart Questions
              </h3>
              <p className="text-gray-600">
                Complete our intelligent questionnaire covering all 9 squares of the marketing framework. 
                Takes 15-20 minutes.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-200">
                AI Analyzes & Strategizes
              </h3>
              <p className="text-gray-600">
                Claude AI analyzes your responses, identifies opportunities, and creates 
                a personalized marketing strategy for your business.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-200">
                Get Your Complete Plan
              </h3>
              <p className="text-gray-600">
                Receive your one-page marketing plan plus detailed implementation guide 
                with specific action steps and timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that have created winning marketing strategies with our AI-powered platform.
          </p>
          <Link href="/questionnaire">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              Create Your Marketing Plan Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-200" />
            </Button>
          </Link>
          <p className="text-blue-200 mt-4 text-sm">
            Free to start • No credit card required • Complete in 20 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="hover:scale-105 transition-transform duration-200">
                <img
                  src="/Beamx-Logo-Colour.png"
                  alt="BeamX Solutions Logo"
                  className="h-12 w-auto max-w-[200px]"
                />
              </div>
              <p className="text-gray-600 mt-4">
                AI-powered marketing plan generator for small businesses and entrepreneurs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/questionnaire" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">
                    Create Plan
                  </Link>
                </li>
                <li>
                  <Link href="/sample-plans" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">
                    Sample Plans
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">Pricing (Coming Soon)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://beamxsolutions.com/tools/business-assessment" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">
                    Business Assessment
                  </a>
                </li>
                <li><span className="text-gray-400">Marketing Guides (Coming Soon)</span></li>
                <li><span className="text-gray-400">Templates (Coming Soon)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="https://beamxsolutions.com/contact" target="_blank" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">
                    Contact Support
                  </a>
                </li>
                <li>
                  <Link href="/questionnaire" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-600">
            <p>&copy; 2025 BeamX Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}