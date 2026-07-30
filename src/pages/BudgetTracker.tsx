import React, { useState, useEffect, useMemo } from 'react'
import { 
  Plus, Trash, Edit2, Check, X, 
  DollarSign, TrendingUp, TrendingDown, Calendar, 
  PiggyBank, Target, ArrowLeft, RefreshCw, AlertCircle,
  Download
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Expense categories matching requirements
const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Housing / Rent', 'Utilities', 
  'Shopping', 'Entertainment', 'Healthcare', 'Education', 
  'Travel', 'Insurance', 'Savings', 'Investments', 'Debt Payments', 'Miscellaneous'
]

// Income categories matching requirements
export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Bonus', 'Interest', 'Investments', 'Gifts', 'Other Income'
]

// Category colors for visuals
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#F59E0B',    // Amber
  'Transportation': '#3B82F6',   // Blue
  'Housing / Rent': '#8B5CF6',    // Violet
  'Utilities': '#06B6D4',       // Cyan
  'Shopping': '#EC4899',        // Pink
  'Entertainment': '#10B981',   // Emerald
  'Healthcare': '#EF4444',      // Red
  'Education': '#6366F1',       // Indigo
  'Travel': '#14B8A6',          // Teal
  'Insurance': '#F97316',       // Orange
  'Savings': '#22C55E',         // Green
  'Investments': '#A855F7',     // Purple
  'Debt Payments': '#64748B',   // Slate
  'Miscellaneous': '#D97706',   // Dark Amber
  // Incomes
  'Salary': '#22C55E',
  'Freelance': '#10B981',
  'Business': '#3B82F6',
  'Bonus': '#F59E0B',
  'Interest': '#06B6D4',
  'Gifts': '#EC4899',
  'Other Income': '#8B5CF6'
}

interface ExpenseItem {
  id: string
  description: string
  category: string
  budgeted: number
  actual: number
  startDate: string
  endDate: string
}

interface IncomeItem {
  category: string
  amount: number
}

interface UpcomingBill {
  id: string
  description: string
  amount: number
  dueDate: string
  paid: boolean
}

export default function BudgetTracker() {
  const currentDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  // 1. STATE INITIALIZATION (with localStorage persistence)
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('budget-expenses')
    if (saved) return JSON.parse(saved)
    return [
      { id: '1', description: 'Monthly Rent', category: 'Housing / Rent', budgeted: 1200, actual: 1200, startDate: '2026-07-01', endDate: '2026-07-31' },
      { id: '2', description: 'Grocery shopping', category: 'Food & Dining', budgeted: 400, actual: 450, startDate: '2026-07-02', endDate: '2026-07-30' },
      { id: '3', description: 'Electric & Water bill', category: 'Utilities', budgeted: 150, actual: 130, startDate: '2026-07-05', endDate: '2026-07-05' },
      { id: '4', description: 'Weekend movie & dinner', category: 'Entertainment', budgeted: 100, actual: 120, startDate: '2026-07-10', endDate: '2026-07-12' },
      { id: '5', description: 'Emergency medical check', category: 'Healthcare', budgeted: 100, actual: 80, startDate: '2026-07-15', endDate: '2026-07-15' },
      { id: '6', description: 'Retirement Fund Contribution', category: 'Savings', budgeted: 500, actual: 500, startDate: '2026-07-01', endDate: '2026-07-31' }
    ]
  })

  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    const saved = localStorage.getItem('budget-incomes')
    if (saved) return JSON.parse(saved)
    return [
      { category: 'Salary', amount: 3500 },
      { category: 'Freelance', amount: 800 },
      { category: 'Business', amount: 0 },
      { category: 'Bonus', amount: 200 },
      { category: 'Interest', amount: 15 },
      { category: 'Investments', amount: 0 },
      { category: 'Gifts', amount: 50 },
      { category: 'Other Income', amount: 0 }
    ]
  })

  const [otherSavings, setOtherSavings] = useState<number>(() => {
    const saved = localStorage.getItem('budget-other-savings')
    return saved ? Number(saved) : 5000
  })

  const [savingsTarget, setSavingsTarget] = useState<number>(() => {
    const saved = localStorage.getItem('budget-savings-target')
    return saved ? Number(saved) : 10000
  })

  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(() => {
    const saved = localStorage.getItem('budget-upcoming-bills')
    if (saved) return JSON.parse(saved)
    return [
      { id: 'b1', description: 'Car Insurance Premium', amount: 150, dueDate: '2026-08-05', paid: false },
      { id: 'b2', description: 'Gym Membership Renewal', amount: 50, dueDate: '2026-08-12', paid: false },
      { id: 'b3', description: 'Internet Subscription', amount: 60, dueDate: '2026-08-15', paid: false }
    ]
  })

  // Form states
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: EXPENSE_CATEGORIES[0],
    budgeted: '',
    actual: '',
    startDate: currentDate,
    endDate: currentDate
  })

  const [newBill, setNewBill] = useState({
    description: '',
    amount: '',
    dueDate: currentDate
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null)
  
  // Interactive hover details for SVG charts
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<'income' | 'expenses' | null>(null)

  // 2. PERSISTENCE SIDE EFFECTS
  useEffect(() => {
    localStorage.setItem('budget-expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('budget-incomes', JSON.stringify(incomes))
  }, [incomes])

  useEffect(() => {
    localStorage.setItem('budget-other-savings', otherSavings.toString())
  }, [otherSavings])

  useEffect(() => {
    localStorage.setItem('budget-savings-target', savingsTarget.toString())
  }, [savingsTarget])

  useEffect(() => {
    localStorage.setItem('budget-upcoming-bills', JSON.stringify(upcomingBills))
  }, [upcomingBills])

  // 3. CORE COMPUTED VALUES
  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, item) => sum + item.amount, 0)
  }, [incomes])

  const totalActualExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.actual, 0)
  }, [expenses])

  const totalBudgetedExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.budgeted, 0)
  }, [expenses])

  const currentBalance = useMemo(() => {
    return totalIncome + otherSavings - totalActualExpenses
  }, [totalIncome, otherSavings, totalActualExpenses])

  const totalRemainingBudget = useMemo(() => {
    return totalBudgetedExpenses - totalActualExpenses
  }, [totalBudgetedExpenses, totalActualExpenses])

  const actualSavings = useMemo(() => {
    // Collect specific savings from table
    const tableSavings = expenses
      .filter(item => item.category === 'Savings' || item.category === 'Investments')
      .reduce((sum, item) => sum + item.actual, 0)
    return otherSavings + tableSavings
  }, [expenses, otherSavings])

  const budgetAlerts = useMemo(() => {
    const alerts: string[] = []
    
    // Check individual items
    expenses.forEach(item => {
      if (item.actual > item.budgeted) {
        alerts.push(`"${item.description}" has exceeded its budget by $${(item.actual - item.budgeted).toFixed(2)}`)
      }
    })

    // Check overall actual vs total budget
    if (totalActualExpenses > totalBudgetedExpenses) {
      alerts.push(`Warning: Total actual spending ($${totalActualExpenses.toFixed(2)}) is higher than your set budget ($${totalBudgetedExpenses.toFixed(2)}).`)
    }

    // Check income threshold
    if (totalActualExpenses > totalIncome * 0.85) {
      alerts.push(`Caution: You have spent ${(totalActualExpenses / totalIncome * 100).toFixed(0)}% of this month's income.`)
    }

    return alerts
  }, [expenses, totalActualExpenses, totalBudgetedExpenses, totalIncome])

  // 4. CHART DATA COMPUTATIONS
  // Expenses grouped by Category
  const expenseByCategoryData = useMemo(() => {
    const categoriesMap: Record<string, number> = {}
    expenses.forEach(item => {
      categoriesMap[item.category] = (categoriesMap[item.category] || 0) + item.actual
    })

    return Object.entries(categoriesMap)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  // Total for donut rendering
  const donutTotal = useMemo(() => {
    return expenseByCategoryData.reduce((sum, item) => sum + item.value, 0)
  }, [expenseByCategoryData])

  // Spending trend over the month (Line Chart cumulative)
  const spendingTrendData = useMemo(() => {
    const datesMap: Record<string, number> = {}
    expenses.forEach(item => {
      // Group by start date
      const date = item.startDate
      datesMap[date] = (datesMap[date] || 0) + item.actual
    })

    // Sort dates
    const sortedDates = Object.keys(datesMap).sort()
    let cumulative = 0
    return sortedDates.map(date => {
      cumulative += datesMap[date]
      return { date, amount: cumulative }
    })
  }, [expenses])

  const exportToCSV = () => {
    const headers = ['Expenses Description', 'Categories', 'Budgeted', 'Actual', 'Remaining Budget', 'Start Date', 'End Date']
    const rows = expenses.map(item => [
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.budgeted,
      item.actual,
      item.budgeted - item.actual,
      item.startDate,
      item.endDate
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Budget_Tracker_Expenses_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 5. TRANSACTION HANDLERS
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpense.description || !newExpense.budgeted || !newExpense.actual) return

    const item: ExpenseItem = {
      id: Date.now().toString(),
      description: newExpense.description,
      category: newExpense.category,
      budgeted: Number(newExpense.budgeted),
      actual: Number(newExpense.actual),
      startDate: newExpense.startDate,
      endDate: newExpense.endDate
    }

    setExpenses(prev => [...prev, item])
    setNewExpense({
      description: '',
      category: EXPENSE_CATEGORIES[0],
      budgeted: '',
      actual: '',
      startDate: currentDate,
      endDate: currentDate
    })
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id))
  }

  const startEditExpense = (item: ExpenseItem) => {
    setEditingId(item.id)
    setEditingExpense({ ...item })
  }

  const saveEditExpense = () => {
    if (!editingExpense) return
    setExpenses(prev => prev.map(item => item.id === editingExpense.id ? editingExpense : item))
    setEditingId(null)
    setEditingExpense(null)
  }

  const handleIncomeChange = (category: string, value: string) => {
    const val = value === '' ? 0 : Number(value)
    setIncomes(prev => prev.map(item => item.category === category ? { ...item, amount: val } : item))
  }

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBill.description || !newBill.amount) return

    const bill: UpcomingBill = {
      id: Date.now().toString(),
      description: newBill.description,
      amount: Number(newBill.amount),
      dueDate: newBill.dueDate,
      paid: false
    }
    setUpcomingBills(prev => [...prev, bill])
    setNewBill({ description: '', amount: '', dueDate: currentDate })
  }

  const toggleBillPaid = (id: string) => {
    setUpcomingBills(prev => prev.map(bill => {
      if (bill.id === id) {
        const nextPaid = !bill.paid
        // If marked paid, automatically add to actual expenses list!
        if (nextPaid) {
          const matchingCategory = EXPENSE_CATEGORIES.includes(bill.description) 
            ? bill.description 
            : 'Bills & Utilities'
          
          const newExp: ExpenseItem = {
            id: 'bill-' + bill.id,
            description: bill.description,
            category: EXPENSE_CATEGORIES.includes(matchingCategory) ? matchingCategory : 'Utilities',
            budgeted: bill.amount,
            actual: bill.amount,
            startDate: bill.dueDate,
            endDate: bill.dueDate
          }
          setExpenses(prevExpenses => [...prevExpenses, newExp])
        } else {
          // If unpaid, remove from expenses
          setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== 'bill-' + bill.id))
        }
        return { ...bill, paid: nextPaid }
      }
      return bill
    }))
  }

  const deleteBill = (id: string) => {
    setUpcomingBills(prev => prev.filter(bill => bill.id !== id))
    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== 'bill-' + id))
  }

  const resetAllData = () => {
    if (confirm('Are you sure you want to reset all budget and tracking data to default?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-12 md:py-16 theme-text-primary">
      {/* Back to Projects Link */}
      <div className="mb-6 flex justify-between items-center">
        <Link 
          to="/projects" 
          className="group flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Projects
        </Link>
        <button
          onClick={resetAllData}
          className="flex items-center gap-1 px-3 py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-sm uppercase font-bold tracking-wider hover:bg-red-500 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          Reset Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="border-b theme-border pb-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-sm font-black tracking-widest text-[#0171E3] uppercase">FINANCE SUITE</span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl theme-text-primary mt-1">
              Budget Management tracker<span className="text-neutral-500">.</span>
            </h1>
            <p className="mt-2 max-w-xl theme-text-secondary text-sm leading-relaxed">
              Track income, customize actual versus budgeted spending models, configure savings targets, and review interactive visualizations.
            </p>
          </div>
          {/* Current Date Display */}
          <div className="flex items-center gap-2 rounded-xl bt-surface border px-4 py-2 text-xs">
            <Calendar className="h-4 w-4 text-[#0171E3]" />
            <span className="bt-text-muted">Current Date:</span>
            <span className="font-bold bt-text">{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        
        {/* Metric 1: Current Balance */}
        <div className="relative overflow-hidden rounded-2xl border bt-surface backdrop-blur-md p-5 flex flex-col justify-between h-[150px] transition-all hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-widest bt-text-muted">💰 Current Balance</span>
            <div className="rounded-lg bg-blue-500/10 p-1.5 text-blue-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-extrabold tracking-tight">
              ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs bt-text-muted mt-1">
              Includes cash, savings, and investments
            </div>
          </div>
        </div>

        {/* Metric 2: Total Income */}
        <div className="relative overflow-hidden rounded-2xl border bt-surface backdrop-blur-md p-5 flex flex-col justify-between h-[150px] transition-all hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-widest bt-text-muted">📈 Total Income</span>
            <div className="rounded-lg bg-green-500/10 p-1.5 text-green-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-extrabold tracking-tight text-green-400">
              ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs bt-text-muted mt-1">
              Combined from salary, bonus, freelance
            </div>
          </div>
        </div>

        {/* Metric 3: Total Expenses */}
        <div className="relative overflow-hidden rounded-2xl border bt-surface backdrop-blur-md p-5 flex flex-col justify-between h-[150px] transition-all hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-widest bt-text-muted">📉 Total Expenses</span>
            <div className="rounded-lg bg-red-500/10 p-1.5 text-red-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-2xl font-extrabold tracking-tight text-red-400">
              ${totalActualExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs bt-text-muted mt-1">
              Set budget was ${totalBudgetedExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Metric 4: Budget Remaining */}
        <div className="relative overflow-hidden rounded-2xl border bt-surface backdrop-blur-md p-5 flex flex-col justify-between h-[150px] transition-all hover:scale-[1.01]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-widest bt-text-muted">🎯 Budget Remaining</span>
            <div className={`rounded-lg p-1.5 ${totalRemainingBudget >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className={`font-display text-2xl font-extrabold tracking-tight ${totalRemainingBudget >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalRemainingBudget < 0 ? '-' : ''}${Math.abs(totalRemainingBudget).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs bt-text-muted mt-1">
              {totalRemainingBudget >= 0 ? 'Within budget bounds' : 'Exceeded planned budget'}
            </div>
          </div>
        </div>

      </div>

      {/* Main Panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* Column 1 & 2: Main Input Forms, Alerts & Visual Dashboard Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Income, Savings, and Targets Config Card */}
          <div className="rounded-2xl border bt-surface backdrop-blur-md p-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider bt-text mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
              <PiggyBank className="h-4 w-4 text-[#0171E3]" />
              Setup Income & Savings Target
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Savings & Cash Inputs */}
              <div>
                <label className="block text-sm font-bold uppercase bt-text-muted mb-1">
                  Other Income / Savings
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs bt-text-muted">$</span>
                  <input
                    type="number"
                    value={otherSavings || ''}
                    onChange={(e) => setOtherSavings(Number(e.target.value))}
                    className="w-full rounded-lg bt-input pl-7 pr-3 py-2 text-sm"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs bt-text-muted mt-1">Initial starting capital savings balance</p>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase bt-text-muted mb-1">
                  Savings Goal Target
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs bt-text-muted">$</span>
                  <input
                    type="number"
                    value={savingsTarget || ''}
                    onChange={(e) => setSavingsTarget(Number(e.target.value))}
                    className="w-full rounded-lg bt-input pl-7 pr-3 py-2 text-sm"
                    placeholder="10000"
                  />
                </div>
                <p className="text-xs bt-text-muted mt-1">Target savings goal target metric</p>
              </div>

              {/* Savings progress tracker bar */}
              <div className="flex flex-col justify-end">
                <div className="flex justify-between text-sm bt-text-muted font-bold mb-1">
                  <span>💵 Savings Progress</span>
                  <span>{((actualSavings / Math.max(1, savingsTarget)) * 100).toFixed(0)}%</span>
                </div>
                <div className="relative w-full h-3 bt-surface border rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (actualSavings / Math.max(1, savingsTarget)) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-right text-emerald-400 mt-1 font-semibold">
                  Saved: ${actualSavings.toLocaleString()} / ${savingsTarget.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Income categories detailed collapse/inputs grid */}
            <div className="mt-6 border-t border-white/5 pt-4">
              <h3 className="text-sm font-bold uppercase bt-text-muted mb-3">Modify Monthly Income Source Fields</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {incomes.map((item) => (
                  <div key={item.category}>
                    <label className="block text-xs font-semibold bt-text-muted mb-0.5">{item.category}</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-sm bt-text-muted">$</span>
                      <input
                        type="number"
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => handleIncomeChange(item.category, e.target.value)}
                        className="w-full rounded-md bt-input pl-5 pr-2 py-1 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BUDGET ALERTS SECTION */}
          {budgetAlerts.length > 0 && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase mb-3">
                <AlertCircle className="h-4 w-4" />
                ⚠️ Budget Alerts & Threshold Notifications
              </div>
              <ul className="space-y-2">
                {budgetAlerts.map((alert, index) => (
                  <li key={index} className="text-xs text-red-300 flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* GRAPH VISUALIZATIONS DASHBOARD CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Donut Chart: Category Expenses */}
            <div className="rounded-2xl border bt-surface p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider bt-text mb-4">
                  🥧 Expenses by Category
                </h3>
                {expenseByCategoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-48 bt-text-muted text-xs">
                    No expense data available
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                    {/* SVG Donut */}
                    <div className="relative w-36 h-36 flex-shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        {(() => {
                          let accumulatedPercentage = 0
                          return expenseByCategoryData.map((item, idx) => {
                            const percent = (item.value / donutTotal) * 100
                            const strokeDasharray = `${percent} ${100 - percent}`
                            const strokeDashoffset = 100 - accumulatedPercentage + 25
                            accumulatedPercentage += percent
                            const color = CATEGORY_COLORS[item.name] || '#94A3B8'
                            const isHovered = hoveredPieIndex === idx

                            return (
                              <circle
                                key={idx}
                                cx="21"
                                cy="21"
                                r="15.915"
                                fill="transparent"
                                stroke={color}
                                strokeWidth={isHovered ? 4.5 : 3.5}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredPieIndex(idx)}
                                onMouseLeave={() => setHoveredPieIndex(null)}
                              />
                            )
                          })
                        })()}
                      </svg>
                      {/* Center labels */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs bt-text-muted uppercase font-semibold">Total Actual</span>
                        <span className="text-sm font-black">${donutTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="w-full overflow-y-auto max-h-36 pr-1 space-y-1">
                      {expenseByCategoryData.slice(0, 5).map((item, idx) => {
                        const percent = (item.value / donutTotal) * 100
                        const color = CATEGORY_COLORS[item.name] || '#94A3B8'
                        const isHovered = hoveredPieIndex === idx
                        return (
                          <div 
                            key={idx} 
                            className={`flex justify-between items-center text-sm p-1 rounded transition-colors duration-150 ${isHovered ? 'bg-white/5 font-semibold bt-text' : 'bt-text-muted'}`}
                            onMouseEnter={() => setHoveredPieIndex(idx)}
                            onMouseLeave={() => setHoveredPieIndex(null)}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                              <span className="truncate">{item.name}</span>
                            </div>
                            <span className="flex-shrink-0 ml-1 font-mono">${item.value.toFixed(0)} ({percent.toFixed(0)}%)</span>
                          </div>
                        )
                      })}
                      {expenseByCategoryData.length > 5 && (
                        <div className="text-xs bt-text-muted text-center pt-1 border-t border-white/5">
                          + {expenseByCategoryData.length - 5} more categories
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart: Income vs Expenses */}
            <div className="rounded-2xl border bt-surface p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider bt-text mb-4">
                  📊 Income vs Expenses
                </h3>
                
                <div className="h-44 flex items-end justify-around gap-4 pb-2 pt-4 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-white/5">
                    <div className="w-full border-t border-white/5" />
                    <div className="w-full border-t border-white/5" />
                    <div className="w-full border-t border-white/5" />
                  </div>

                  {/* Income Bar */}
                  {(() => {
                    const maxValue = Math.max(totalIncome, totalActualExpenses, 1)
                    const incHeight = (totalIncome / maxValue) * 120
                    const expHeight = (totalActualExpenses / maxValue) * 120
                    
                    return (
                      <>
                        {/* Income Bar */}
                        <div className="flex flex-col items-center z-10 w-full">
                          <div className="text-sm font-bold text-green-400 mb-1">${totalIncome.toFixed(0)}</div>
                          <div 
                            className={`w-14 bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-lg transition-all duration-300 relative group cursor-pointer ${hoveredBar === 'income' ? 'brightness-110 shadow-lg shadow-green-500/20' : ''}`}
                            style={{ height: `${incHeight}px` }}
                            onMouseEnter={() => setHoveredBar('income')}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                          <span className="text-xs uppercase tracking-wider bt-text-muted font-semibold mt-2">Income</span>
                        </div>

                        {/* Expense Bar */}
                        <div className="flex flex-col items-center z-10 w-full">
                          <div className="text-sm font-bold text-red-400 mb-1">${totalActualExpenses.toFixed(0)}</div>
                          <div 
                            className={`w-14 bg-gradient-to-t from-red-600 to-rose-400 rounded-t-lg transition-all duration-300 relative group cursor-pointer ${hoveredBar === 'expenses' ? 'brightness-110 shadow-lg shadow-red-500/20' : ''}`}
                            style={{ height: `${expHeight}px` }}
                            onMouseEnter={() => setHoveredBar('expenses')}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                          <span className="text-xs uppercase tracking-wider bt-text-muted font-semibold mt-2">Expenses</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Line Chart: Monthly Spending Trend */}
            <div className="rounded-2xl border bt-surface p-5 md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider bt-text mb-4">
                  📈 Monthly Spending Trend (Cumulative)
                </h3>
                
                {spendingTrendData.length === 0 ? (
                  <div className="flex items-center justify-center h-32 bt-text-muted text-xs">
                    Add transactions with dates to display spending curve
                  </div>
                ) : (
                  <div className="h-36 w-full relative pt-2">
                    <svg viewBox="0 0 500 100" width="100%" height="100%" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                      {(() => {
                        const maxValue = Math.max(...spendingTrendData.map(d => d.amount), 1)
                        const pointsCount = spendingTrendData.length
                        const widthStep = 500 / Math.max(1, pointsCount - 1)
                        
                        // Map coordinates
                        const coords = spendingTrendData.map((d, index) => {
                          const x = index * widthStep
                          const y = 90 - (d.amount / maxValue) * 80
                          return { x, y, date: d.date, amount: d.amount }
                        })

                        // Path strings
                        const pathD = coords.reduce((acc, point, index) => {
                          return acc + `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                        }, '')

                        // Gradient fill string
                        const fillD = pathD + ` L ${coords[coords.length - 1].x} 100 L 0 100 Z`

                        return (
                          <>
                            {/* Area Gradient Def */}
                            <defs>
                              <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0171E3" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#0171E3" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Chart Area Fill */}
                            <path d={fillD} fill="url(#spendingGrad)" />

                            {/* Chart Line */}
                            <path d={pathD} fill="none" stroke="#0171E3" strokeWidth="2" strokeLinecap="round" />

                            {/* Interactive Data Nodes */}
                            {coords.map((point, idx) => (
                              <g key={idx} className="group cursor-pointer">
                                <circle 
                                  cx={point.x} 
                                  cy={point.y} 
                                  r="3" 
                                  fill="#0171E3" 
                                  stroke="#FFFFFF" 
                                  strokeWidth="1" 
                                  className="transition-all duration-200 hover:r-5" 
                                />
                                {/* Custom visual tooltips */}
                                <title>{`${point.date}: $${point.amount.toFixed(0)}`}</title>
                              </g>
                            ))}
                          </>
                        )
                      })()}
                    </svg>
                    
                    {/* Line Chart labels */}
                    <div className="flex justify-between text-xs bt-text-muted mt-2 font-mono">
                      <span>{spendingTrendData[0]?.date}</span>
                      <span>{spendingTrendData[Math.floor(spendingTrendData.length / 2)]?.date}</span>
                      <span>{spendingTrendData[spendingTrendData.length - 1]?.date}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Column 3: Add Expense Form & Upcoming Bills sidebar */}
        <div className="space-y-6">

          {/* Quick Expense Creator Card */}
          <div className="rounded-2xl border bt-surface backdrop-blur-md p-5">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider bt-text mb-4 flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-[#0171E3]" />
              Add New Expense Item
            </h3>
            
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase bt-text-muted mb-1">
                  Expenses Description
                </label>
                <input
                  type="text"
                  required
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg bt-input px-3 py-2 text-sm"
                  placeholder="e.g. Weekly Groceries"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase bt-text-muted mb-1">
                    Categories
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg bt-input px-2 py-2 text-sm cursor-pointer"
                  >
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase bt-text-muted mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpense.startDate}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-lg bt-input px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase bt-text-muted mb-1">
                    Budgeted ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newExpense.budgeted}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, budgeted: e.target.value }))}
                    className="w-full rounded-lg bt-input px-3 py-2 text-sm"
                    placeholder="100.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase bt-text-muted mb-1">
                    Actual ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newExpense.actual}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, actual: e.target.value }))}
                    className="w-full rounded-lg bt-input px-3 py-2 text-sm"
                    placeholder="90.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase bt-text-muted mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={newExpense.endDate}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-lg bt-input px-3 py-1.5 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#0171E3] hover:bg-blue-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all active-spring-scale cursor-pointer"
              >
                Add Transaction
              </button>
            </form>
          </div>

          {/* Upcoming Bills Planner Card */}
          <div className="rounded-2xl border bt-surface backdrop-blur-md p-5">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider bt-text mb-4 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#0171E3]" />
              📅 Upcoming Bills Scheduler
            </h3>
            
            {/* Quick Bill form */}
            <form onSubmit={handleAddBill} className="flex gap-2 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  required
                  placeholder="Bill Name"
                  value={newBill.description}
                  onChange={(e) => setNewBill(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md bt-input px-2 py-1 text-sm"
                />
              </div>
              <div className="w-16">
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Cost"
                  value={newBill.amount}
                  onChange={(e) => setNewBill(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-md bt-input px-2 py-1 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-3 rounded-md bt-surface border hover:bg-white/20 bt-text font-bold text-xs cursor-pointer"
              >
                +
              </button>
            </form>

            {/* Bills checklist */}
            {upcomingBills.length === 0 ? (
              <div className="text-sm bt-text-muted text-center py-4">No scheduled bills.</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {upcomingBills.map(bill => (
                  <div 
                    key={bill.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-sm transition-all duration-200 ${bill.paid ? 'bg-green-500/5 border-green-500/20 bt-text-muted' : 'bt-surface border'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${bill.paid ? 'bg-green-500 border-green-600 text-white' : 'border-white/20 hover:border-white'}`}
                      >
                        {bill.paid && <Check className="h-2.5 w-2.5" />}
                      </button>
                      <div className="truncate">
                        <p className={`font-semibold truncate ${bill.paid ? 'line-through bt-text-muted' : 'bt-text'}`}>{bill.description}</p>
                        <p className="text-xs bt-text-muted">Due: {bill.dueDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold font-mono ${bill.paid ? 'text-green-500' : 'bt-text'}`}>
                        ${bill.amount.toFixed(0)}
                      </span>
                      <button 
                        onClick={() => deleteBill(bill.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* DETAILED TRANSACTIONS EDITABLE DATA TABLE */}
      <div className="rounded-2xl border bt-surface backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider bt-text">
              📋 Expenses Spreadsheet
            </h3>
            <p className="text-sm bt-text-muted mt-1">
              Add rows, update actuals, and track Remaining Budgets directly.
            </p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={expenses.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bt-surface text-sm bt-text hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed active-spring-scale cursor-pointer font-bold uppercase tracking-wider transition-all"
          >
            <Download className="h-3.5 w-3.5 text-[#0171E3]" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bt-thead uppercase text-xs tracking-wider font-bold">
                <th className="py-3 px-4">Expenses Description</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4 text-right">budgeted</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Remaining budget</th>
                <th className="py-3 px-4">start date</th>
                <th className="py-3 px-4">End date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bt-divide">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 bt-text-muted text-sm">
                    No expense rows currently in spreadsheet
                  </td>
                </tr>
              ) : (
                expenses.map(item => {
                  const isEditing = editingId === item.id
                  const remaining = item.budgeted - item.actual
                  const isOverBudget = remaining < 0

                  return (
                    <tr key={item.id} className="bt-tbody-row">
                      
                      {/* Description */}
                      <td className="py-3 px-4 font-semibold bt-text">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingExpense?.description || ''}
                            onChange={(e) => setEditingExpense(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="bt-table-input w-full"
                          />
                        ) : (
                          item.description
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <select
                            value={editingExpense?.category || ''}
                            onChange={(e) => setEditingExpense(prev => prev ? { ...prev, category: e.target.value } : null)}
                            className="bt-table-input w-full cursor-pointer"
                          >
                            {EXPENSE_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span 
                              className="w-2 h-2 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#94A3B8' }} 
                            />
                            {item.category}
                          </span>
                        )}
                      </td>

                      {/* Budgeted */}
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editingExpense?.budgeted || ''}
                            onChange={(e) => setEditingExpense(prev => prev ? { ...prev, budgeted: Number(e.target.value) } : null)}
                            className="bt-table-input w-20 text-right"
                          />
                        ) : (
                          `$${item.budgeted.toFixed(2)}`
                        )}
                      </td>

                      {/* Actual */}
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editingExpense?.actual || ''}
                            onChange={(e) => setEditingExpense(prev => prev ? { ...prev, actual: Number(e.target.value) } : null)}
                            className="bt-table-input w-20 text-right"
                          />
                        ) : (
                          `$${item.actual.toFixed(2)}`
                        )}
                      </td>

                      {/* Remaining Budget (Computed) */}
                      <td className={`py-3 px-4 text-right font-mono font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                        {isOverBudget ? '-' : ''}${Math.abs(remaining).toFixed(2)}
                        {isOverBudget && (
                          <span className="inline-block ml-1 text-red-500" title="Over budget alert!">
                            ⚠️
                          </span>
                        )}
                      </td>

                      {/* Start Date */}
                      <td className="py-3 px-4 font-mono bt-text-muted">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editingExpense?.startDate || ''}
                            onChange={(e) => setEditingExpense(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                            className="bt-table-input"
                          />
                        ) : (
                          item.startDate
                        )}
                      </td>

                      {/* End Date */}
                      <td className="py-3 px-4 font-mono bt-text-muted">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editingExpense?.endDate || ''}
                            onChange={(e) => setEditingExpense(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                            className="bt-table-input"
                          />
                        ) : (
                          item.endDate
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={saveEditExpense}
                                className="p-1 rounded bg-green-500/20 hover:bg-green-500/40 text-green-400 transition-colors cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors cursor-pointer"
                                title="Cancel edit"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditExpense(item)}
                                className="p-1 rounded bt-surface border hover:bg-white/10 bt-text-muted hover:bt-text transition-all cursor-pointer"
                                title="Edit row"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(item.id)}
                                className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                                title="Delete row"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
