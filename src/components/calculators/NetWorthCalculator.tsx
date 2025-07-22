'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface NetWorthCalculatorProps {
  onCalculate: (netWorth: number) => void
  onCancel: () => void
  initialValue?: number
}

const NetWorthCalculator: React.FC<NetWorthCalculatorProps> = ({ onCalculate, onCancel, initialValue }) => {
  const [assets, setAssets] = useState({
    cash: '',
    savings: '',
    investments: '',
    realEstate: '',
    vehicles: '',
    businessAssets: '',
    otherAssets: ''
  })
  
  const [liabilities, setLiabilities] = useState({
    creditCards: '',
    personalLoans: '',
    carLoans: '',
    mortgage: '',
    businessLoans: '',
    otherDebts: ''
  })

  const totalAssets = Object.values(assets).reduce((sum, value) => sum + (Number(value) || 0), 0)
  const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + (Number(value) || 0), 0)
  const netWorth = totalAssets - totalLiabilities

  const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

  // Helper function to handle numeric input
  const handleNumericInput = (value: string) => {
    // Remove any non-numeric characters except decimal point
    return value.replace(/[^\d.]/g, '')
      // Ensure only one decimal point
      .replace(/(\..*)\./g, '$1')
      // Limit to 2 decimal places
      .replace(/(\.\d{2})\d+/g, '$1')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="space-y-4">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300">Assets (What you own)</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cash & Checking</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.cash}
                onChange={(e) => setAssets(prev => ({ ...prev, cash: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Savings Accounts</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.savings}
                onChange={(e) => setAssets(prev => ({ ...prev, savings: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investments (401k, Stocks, etc.)</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.investments}
                onChange={(e) => setAssets(prev => ({ ...prev, investments: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Real Estate</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.realEstate}
                onChange={(e) => setAssets(prev => ({ ...prev, realEstate: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicles</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.vehicles}
                onChange={(e) => setAssets(prev => ({ ...prev, vehicles: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Assets</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.businessAssets}
                onChange={(e) => setAssets(prev => ({ ...prev, businessAssets: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Assets</label>
              <input
                type="text"
                inputMode="decimal"
                value={assets.otherAssets}
                onChange={(e) => setAssets(prev => ({ ...prev, otherAssets: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="space-y-4">
          <h5 className="font-semibold text-red-700 dark:text-red-300">Liabilities (What you owe)</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credit Cards</label>
              <input
                type="text"
                inputMode="decimal"
                value={liabilities.creditCards}
                onChange={(e) => setLiabilities(prev => ({ ...prev, creditCards: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personal Loans</label>
              <input
                type="text"
                inputMode="decimal"
                value={liabilities.personalLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, personalLoans: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Car Loans</label>
              <input
                type="text"
                inputMode="decimal"
                value={liabilities.carLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, carLoans: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mortgage</label>
              <input
                type="text"
                inputMode="decimal"
                value={liabilities.mortgage}
                onChange={(e) => setLiabilities(prev => ({ ...prev, mortgage: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Loans</label>
              <input
                type="text"
                inputMode="decimal"
                value={liabilities.businessLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, businessLoans: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Debts</label>
              <input
                type="text"
                inputMode="decimal"
                value={liabilities.otherDebts}
                onChange={(e) => setLiabilities(prev => ({ ...prev, otherDebts: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Assets:</span>
            <span className="font-semibold text-blue-700 dark:text-blue-300">${totalAssets.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Liabilities:</span>
            <span className="font-semibold text-red-700 dark:text-red-300">${totalLiabilities.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 dark:text-gray-200 font-semibold">Net Worth:</span>
              <span className={`text-xl font-bold ${netWorth >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                ${netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => onCalculate(netWorth)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Use This Net Worth
        </button>
      </div>
    </div>
  )
}

export default NetWorthCalculator