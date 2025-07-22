'use client'

import { useEffect, useState } from 'react'

export default function IframeDemoPage() {
  const [messageReceived, setMessageReceived] = useState(false)

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from iframe:', event.data)
      
      if (event.data && event.data.type === 'spi-assessment-loaded') {
        setMessageReceived(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
          🚀 SPI Assessment Iframe Demo
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          This page demonstrates how the SPI Assessment looks when embedded in an iframe
        </p>

        {/* Basic Iframe Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Basic Iframe (Fixed Height)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Standard iframe with fixed height of 800px
          </p>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <iframe 
              src="/embed-test" 
              width="100%" 
              height="800" 
              frameBorder="0"
              style={{
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
              allow="clipboard-write; clipboard-read"
              title="SPI Assessment - Basic"
            />
          </div>
          <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`<iframe 
    src="https://spiassessment.com" 
    width="100%" 
    height="800" 
    frameborder="0"
    style="border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
    allow="clipboard-write; clipboard-read"
    title="SPI Assessment">
</iframe>`}
            </pre>
          </div>
        </div>

        {/* Responsive Iframe Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Responsive Iframe (16:9 Aspect Ratio)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Automatically adjusts to container width while maintaining aspect ratio
          </p>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe 
                src="/embed-test" 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
                frameBorder="0"
                allow="clipboard-write; clipboard-read"
                title="SPI Assessment - Responsive"
              />
            </div>
          </div>
          <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe 
        src="https://spiassessment.com" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
               border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
        frameborder="0"
        allow="clipboard-write; clipboard-read"
        title="SPI Assessment">
    </iframe>
</div>`}
            </pre>
          </div>
        </div>

        {/* Message Status */}
        {messageReceived && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✓ Success! The iframe has loaded and sent a confirmation message.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}