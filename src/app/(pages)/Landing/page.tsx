'use client';

import { Cloud, Shield, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CloudyFiles</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-in-left">
                Your Files,
                <span className="text-blue-400 animate-pulse"> Everywhere</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Store, manage, and access your files from anywhere in the world. 
                CloudyFiles provides secure, fast, and reliable cloud storage for all your needs.
              </p>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 text-gray-400">
                <div className="flex items-center gap-2 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-fade-in-up w-full mx-4 lg:mx-0" style={{animationDelay: '0.3s'}}>
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-6 lg:p-8 backdrop-blur-sm border border-gray-700/50 transform hover:scale-105 transition-transform duration-500">
                <div className="bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-2xl">
                  {/* Mock File Manager Interface */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                      <h3 className="text-white font-semibold text-sm lg:text-base">My Files</h3>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
                      {/* File Icons */}
                      <div className="bg-blue-600/20 p-3 lg:p-4 rounded-lg text-center transform hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                        <span className="text-xs text-gray-300">Documents</span>
                      </div>
                      <div className="bg-green-600/20 p-3 lg:p-4 rounded-lg text-center transform hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-600 rounded mx-auto mb-2"></div>
                        <span className="text-xs text-gray-300">Images</span>
                      </div>
                      <div className="bg-purple-600/20 p-3 lg:p-4 rounded-lg text-center transform hover:scale-110 transition-transform duration-300 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-600 rounded mx-auto mb-2"></div>
                        <span className="text-xs text-gray-300">Videos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 lg:w-20 lg:h-20 bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 lg:w-16 lg:h-16 bg-purple-600/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose CloudyFiles?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of cloud storage with our cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-gray-400">Your files are protected with enterprise-grade encryption and security measures.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Upload and download your files at blazing speeds with our global CDN.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
              <p className="text-gray-400">Share files and collaborate with your team effortlessly with smart permissions.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Backup & Sync</h3>
              <p className="text-gray-400">Automatic backup and real-time sync across all your devices and platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CloudyFiles</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most secure and reliable cloud storage solution for individuals and businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400">© 2025 CloudyFiles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
