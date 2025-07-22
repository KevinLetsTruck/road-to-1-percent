interface ProgressIndicatorProps {
  current: number
  target: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'indigo' | 'green' | 'yellow' | 'red'
}

export default function ProgressIndicator({
  current,
  target,
  label,
  showPercentage = true,
  size = 'md',
  color = 'indigo'
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100)
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
  
  const colorClasses = {
    indigo: 'bg-indigo-600 dark:bg-indigo-400',
    green: 'bg-green-600 dark:bg-green-400',
    yellow: 'bg-yellow-600 dark:bg-yellow-400',
    red: 'bg-red-600 dark:bg-red-400'
  }
  
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}