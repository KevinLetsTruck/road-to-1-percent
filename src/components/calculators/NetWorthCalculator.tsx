'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface NetWorthCalculatorProps {
  onCalculate: (netWorth: number) => void
  onCancel: () => void
}

const NetWorthCalculator: React.FC<NetWorthCalculatorProps> = ({ onCalculate, onCancel }) => {
  const [assets, setAssets] = useState({
    cash: 0,
    savings: 0,
    investments: 0,
    realEstate: 0,
    vehicles: 0,
    businessAssets: 0,
    otherAssets: 0
  })
  
  const [liabilities, setLiabilities] = useState({
    creditCards: 0,
    personalLoans: 0,
    carLoans: 0,
    mortgage: 0,
    businessLoans: 0,
    otherDebts: 0
  })

  const totalAssets = Object.values(assets).reduce((sum, value) => sum + value, 0)
  const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + value, 0)
  const netWorth = totalAssets - totalLiabilities

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
                type="number"
                value={assets.cash}
                onChange={(e) => setAssets(prev => ({ ...prev, cash: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Savings Accounts</label>
              <input
                type="number"
                value={assets.savings}
                onChange={(e) => setAssets(prev => ({ ...prev, savings: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investments (401k, IRA, etc.)</label>
              <input
                type="number"
                value={assets.investments}
                onChange={(e) => setAssets(prev => ({ ...prev, investments: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Real Estate Value</label>
              <input
                type="number"
                value={assets.realEstate}
                onChange={(e) => setAssets(prev => ({ ...prev, realEstate: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicles Value</label>
              <input
                type="number"
                value={assets.vehicles}
                onChange={(e) => setAssets(prev => ({ ...prev, vehicles: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Assets</label>
              <input
                type="number"
                value={assets.businessAssets}
                onChange={(e) => setAssets(prev => ({ ...prev, businessAssets: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Assets</label>
              <input
                type="number"
                value={assets.otherAssets}
                onChange={(e) => setAssets(prev => ({ ...prev, otherAssets: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="space-y-4">
          <h5 className="font-semibold text-red-700 dark:text-red-300">Liabilities (What you owe)</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credit Card Debt</label>
              <input
                type="number"
                value={liabilities.creditCards}
                onChange={(e) => setLiabilities(prev => ({ ...prev, creditCards: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personal Loans</label>
              <input
                type="number"
                value={liabilities.personalLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, personalLoans: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Car Loans</label>
              <input
                type="number"
                value={liabilities.carLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, carLoans: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mortgage</label>
              <input
                type="number"
                value={liabilities.mortgage}
                onChange={(e) => setLiabilities(prev => ({ ...prev, mortgage: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Loans</label>
              <input
                type="number"
                value={liabilities.businessLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, businessLoans: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Debts</label>
              <input
                type="number"
                value={liabilities.otherDebts}
                onChange={(e) => setLiabilities(prev => ({ ...prev, otherDebts: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Assets</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">${totalAssets.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Liabilities</div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">${totalLiabilities.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Net Worth</div>
            <div className={`text-lg font-bold ${netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${netWorth.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

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