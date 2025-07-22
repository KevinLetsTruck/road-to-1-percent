'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface MonthlySavingsCalculatorProps {
  onCalculate: (monthlySavings: number) => void
  onCancel: () => void
  initialValue?: number
}

const MonthlySavingsCalculator: React.FC<MonthlySavingsCalculatorProps> = ({ onCalculate, onCancel, initialValue }) => {
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
        {/* Income */}
        <div className="space-y-4">
          <h5 className="font-semibold text-green-700 dark:text-green-300">Monthly Income</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary (After Tax)</label>
              <input
                type="text"
                inputMode="decimal"
                value={income.salary}
                onChange={(e) => setIncome(prev => ({ ...prev, salary: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bonuses/Commissions</label>
              <input
                type="text"
                inputMode="decimal"
                value={income.bonuses}
                onChange={(e) => setIncome(prev => ({ ...prev, bonuses: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Side Income</label>
              <input
                type="text"
                inputMode="decimal"
                value={income.sideIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, sideIncome: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Income</label>
              <input
                type="text"
                inputMode="decimal"
                value={income.otherIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, otherIncome: handleNumericInput(e.target.value) }))}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Housing (Rent/Mortgage)</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.housing}
                onChange={(e) => setExpenses(prev => ({ ...prev, housing: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilities</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.utilities}
                onChange={(e) => setExpenses(prev => ({ ...prev, utilities: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Food & Groceries</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.food}
                onChange={(e) => setExpenses(prev => ({ ...prev, food: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transportation</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.transportation}
                onChange={(e) => setExpenses(prev => ({ ...prev, transportation: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.insurance}
                onChange={(e) => setExpenses(prev => ({ ...prev, insurance: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Debt Payments</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.debts}
                onChange={(e) => setExpenses(prev => ({ ...prev, debts: handleNumericInput(e.target.value) }))}
                className={inputClassName}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Expenses</label>
              <input
                type="text"
                inputMode="decimal"
                value={expenses.otherExpenses}
                onChange={(e) => setExpenses(prev => ({ ...prev, otherExpenses: handleNumericInput(e.target.value) }))}
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
            <span className="text-gray-600 dark:text-gray-300">Total Income:</span>
            <span className="font-semibold text-green-700 dark:text-green-300">${totalIncome.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Expenses:</span>
            <span className="font-semibold text-red-700 dark:text-red-300">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 dark:text-gray-200 font-semibold">Monthly Savings:</span>
              <span className={`text-xl font-bold ${monthlySavings >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                ${monthlySavings.toLocaleString()}/month
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