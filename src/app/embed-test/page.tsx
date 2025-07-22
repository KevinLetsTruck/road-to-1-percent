'use client'

import { useEffect, useState } from 'react'

export default function EmbedTestPage() {
  const [isEmbedded, setIsEmbedded] = useState(false)
  const [parentOrigin, setParentOrigin] = useState<string>('')

  useEffect(() => {
    // Check if we're in an iframe
    const embedded = window.self !== window.top
    setIsEmbedded(embedded)

    // Get parent origin if embedded
    if (embedded) {
      try {
        setParentOrigin(document.referrer || 'Unknown origin')
      } catch (e) {
        setParentOrigin('Cross-origin (blocked)')
      }
    }

    // Send message to parent window (if exists) to confirm iframe is loaded
    if (embedded && window.parent) {
      window.parent.postMessage(
        { 
          type: 'spi-assessment-loaded',
          message: 'SPI Assessment iframe loaded successfully'
        },
        '*'
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          SPI Assessment Embed Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Embed Status
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-40">
                Embedded in iframe:
              </span>
              <span className={`font-semibold ${isEmbedded ? 'text-green-600' : 'text-red-600'}`}>
                {isEmbedded ? 'Yes ✓' : 'No ✗'}
              </span>
            </div>
            
            {isEmbedded && (
              <div className="flex items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-40">
                  Parent origin:
                </span>
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                  {parentOrigin}
                </span>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-40">
                Current URL:
              </span>
              <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Integration Instructions
          </h3>
          
          {isEmbedded ? (
            <div className="space-y-2 text-blue-800 dark:text-blue-200">
              <p>✅ Great! The SPI Assessment is successfully embedded in an iframe.</p>
              <p>Users can now:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Create accounts and log in</li>
                <li>Complete assessments</li>
                <li>View their results</li>
                <li>Track their progress over time</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2 text-blue-800 dark:text-blue-200">
              <p>This page is currently being viewed directly, not in an iframe.</p>
              <p>To test iframe embedding:</p>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Visit <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">/iframe-embed.html</code> for embed instructions</li>
                <li>Copy one of the provided iframe codes</li>
                <li>Paste it into your Mighty Networks HTML block</li>
                <li>The assessment will load within your site</li>
              </ol>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Assessment →
          </a>
        </div>
      </div>
    </div>
  )
}