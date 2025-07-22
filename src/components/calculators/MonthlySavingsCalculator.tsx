'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface MonthlySavingsCalculatorProps {
  onCalculate: (monthlySavings: number) => void
  onCancel: () => void
}

const MonthlySavingsCalculator: React.FC<MonthlySavingsCalculatorProps> = ({ onCalculate, onCancel }) => {
  const [income, setIncome] = useState({
    salary: '',
    bonuses: '',
    sideIncome: '',
    otherIncome: ''
  })
  
  const [expenses, setExpenses] = useState({
    housing: '',
    utilities: '',
    food: '',
    transportation: '',
    insurance: '',
    debts: '',
    otherExpenses: ''
  })

  const totalIncome = Object.values(income).reduce((sum, value) => sum + (Number(value) || 0), 0)
  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (Number(value) || 0), 0)
  const monthlySavings = totalIncome - totalExpenses

  const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income */}
        <div className="space-y-4">
          <h5 className="font-semibold text-green-700 dark:text-green-300">Monthly Income</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Salary (after taxes)</label>
              <input
                type="number"
                value={income.salary}
                onChange={(e) => setIncome(prev => ({ ...prev, salary: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bonuses/Commissions</label>
              <input
                type="number"
                value={income.bonuses}
                onChange={(e) => setIncome(prev => ({ ...prev, bonuses: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Side Income</label>
              <input
                type="number"
                value={income.sideIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, sideIncome: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Income</label>
              <input
                type="number"
                value={income.otherIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, otherIncome: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="space-y-4">
          <h5 className="font-semibold text-red-700 dark:text-red-300">Monthly Expenses</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Housing (rent/mortgage)</label>
              <input
                type="number"
                value={expenses.housing}
                onChange={(e) => setExpenses(prev => ({ ...prev, housing: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilities</label>
              <input
                type="number"
                value={expenses.utilities}
                onChange={(e) => setExpenses(prev => ({ ...prev, utilities: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Food & Groceries</label>
              <input
                type="number"
                value={expenses.food}
                onChange={(e) => setExpenses(prev => ({ ...prev, food: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transportation</label>
              <input
                type="number"
                value={expenses.transportation}
                onChange={(e) => setExpenses(prev => ({ ...prev, transportation: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance</label>
              <input
                type="number"
                value={expenses.insurance}
                onChange={(e) => setExpenses(prev => ({ ...prev, insurance: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Debt Payments</label>
              <input
                type="number"
                value={expenses.debts}
                onChange={(e) => setExpenses(prev => ({ ...prev, debts: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Expenses</label>
              <input
                type="number"
                value={expenses.otherExpenses}
                onChange={(e) => setExpenses(prev => ({ ...prev, otherExpenses: e.target.value }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Income</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">${totalIncome.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">${totalExpenses.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings</div>
            <div className={`text-lg font-bold ${monthlySavings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${monthlySavings.toLocaleString()}
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
          onClick={() => onCalculate(monthlySavings)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Use This Monthly Savings
        </button>
      </div>
    </div>
  )
}

export default MonthlySavingsCalculator