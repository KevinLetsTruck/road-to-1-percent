export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Loading...</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Preparing your experience</p>
      </div>
    </div>
  )
}