'use client'

import { useState } from 'react'

export default function IframeEmbedPage() {
  const [copiedSection, setCopiedSection] = useState<string>('')

  const copyCode = (elementId: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSection(elementId)
    setTimeout(() => setCopiedSection(''), 2000)
  }

  const basicCode = `<iframe 
    src="https://spiassessment.com" 
    width="100%" 
    height="800" 
    frameborder="0"
    style="border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
    allow="clipboard-write; clipboard-read"
    title="SPI Assessment">
</iframe>`

  const responsiveCode = `<div style="position: relative; padding-bottom: 100%; height: 0; overflow: hidden; max-width: 100%;">
    <iframe 
        src="https://spiassessment.com" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
        frameborder="0"
        allow="clipboard-write; clipboard-read"
        title="SPI Assessment">
    </iframe>
</div>`

  const advancedCode = `<script>
function resizeIframe() {
    var iframe = document.getElementById('spi-assessment-iframe');
    if (iframe) {
        iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
    }
}
</script>

<iframe 
    id="spi-assessment-iframe"
    src="https://spiassessment.com" 
    width="100%" 
    height="800"
    frameborder="0"
    onload="resizeIframe()"
    style="border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-height: 800px;"
    allow="clipboard-write; clipboard-read"
    title="SPI Assessment">
</iframe>`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🚀 SPI Assessment - Mighty Networks Embed Guide
          </h1>
          
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            This guide will help you embed the SPI Assessment application into your Mighty Networks site using an iframe.
          </p>

          {/* Basic Iframe Code */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📋 Basic Iframe Code
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Copy and paste this code into your Mighty Networks HTML block:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{basicCode}</code>
              </pre>
              <button
                onClick={() => copyCode('basic', basicCode)}
                className={`absolute top-2 right-2 px-4 py-2 rounded text-white font-medium transition-colors ${
                  copiedSection === 'basic' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {copiedSection === 'basic' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </section>

          {/* Responsive Iframe Code */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🎨 Responsive Iframe Code (Recommended)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This version automatically adjusts to different screen sizes:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{responsiveCode}</code>
              </pre>
              <button
                onClick={() => copyCode('responsive', responsiveCode)}
                className={`absolute top-2 right-2 px-4 py-2 rounded text-white font-medium transition-colors ${
                  copiedSection === 'responsive' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {copiedSection === 'responsive' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </section>

          {/* Advanced Iframe Code */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🔧 Advanced Iframe with Auto-Resize
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This version automatically adjusts height based on content:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{advancedCode}</code>
              </pre>
              <button
                onClick={() => copyCode('advanced', advancedCode)}
                className={`absolute top-2 right-2 px-4 py-2 rounded text-white font-medium transition-colors ${
                  copiedSection === 'advanced' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {copiedSection === 'advanced' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </section>

          {/* Important Notes */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
              ⚠️ Important Notes for Mighty Networks:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>You must have HTML embed permissions in your Mighty Networks plan</li>
              <li>Add the embed code in a "Custom HTML" block</li>
              <li>The assessment requires users to have JavaScript enabled</li>
              <li>Users will need to allow cookies for authentication to work properly</li>
            </ul>
          </div>

          {/* Embedding Instructions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🎯 Embedding in Mighty Networks
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Log into your Mighty Networks admin panel</li>
              <li>Navigate to the page where you want to embed the assessment</li>
              <li>Click "Add Content" or "Edit Page"</li>
              <li>Select "Custom HTML" or "Embed" block</li>
              <li>Paste one of the iframe codes above</li>
              <li>Save and publish your changes</li>
            </ol>
          </section>

          {/* Customization Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🛠️ Customization Options
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can customize the iframe appearance by modifying these parameters:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong className="font-semibold">width:</strong> Set to any pixel value or percentage (default: "100%")</li>
              <li><strong className="font-semibold">height:</strong> Adjust based on your needs (default: "800")</li>
              <li><strong className="font-semibold">style:</strong> Add custom CSS for borders, shadows, etc.</li>
            </ul>
          </section>

          {/* Security Considerations */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
              🔒 Security Considerations
            </h3>
            <p className="text-green-700 dark:text-green-300 font-medium mb-3">
              ✅ The SPI Assessment iframe is secure and includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-700 dark:text-green-300">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure authentication system</li>
              <li>No access to parent window data</li>
              <li>CORS headers properly configured</li>
            </ul>
          </div>

          {/* Mobile Considerations */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📱 Mobile Considerations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The SPI Assessment is fully responsive and works on all devices. However, for the best mobile experience in Mighty Networks:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Use the responsive iframe code</li>
              <li>Consider setting a minimum height of 600px for mobile devices</li>
              <li>Test on various devices before publishing</li>
            </ul>
          </section>

          {/* Troubleshooting */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🐛 Troubleshooting
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">If you encounter issues:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong className="font-semibold">Blank iframe:</strong> Check if HTTPS is required by Mighty Networks</li>
              <li><strong className="font-semibold">Authentication issues:</strong> Ensure third-party cookies are enabled</li>
              <li><strong className="font-semibold">Height issues:</strong> Try the responsive or auto-resize versions</li>
              <li><strong className="font-semibold">Not loading:</strong> Verify HTML embed permissions in your Mighty Networks plan</li>
            </ul>
          </section>

          {/* Demo Links */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/iframe-demo"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors mr-4"
            >
              View Live Demo →
            </a>
            <a
              href="/embed-test"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Test Embed Status →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}