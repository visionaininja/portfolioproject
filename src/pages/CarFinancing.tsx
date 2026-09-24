import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Car, Plus, TrendingUp, 
  RotateCcw, Edit2, Trash2, ArrowLeft,
  PieChart, Calendar, Clock, Lock, Unlock, Eye, EyeOff, ShieldAlert, KeyRound,
  Database, RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import CarProgressVisualization from '../components/car-financing/CarProgressVisualization.tsx'
import CarImageUploader from '../components/car-financing/CarImageUploader.tsx'
import CarLoanModal, { CarLoanData, getNextPaymentDueDate } from '../components/car-financing/CarLoanModal.tsx'

const DEFAULT_CAR_LOANS: CarLoanData[] = [
  {
    id: 'loan_vios_1',
    carName: 'Toyota Vios 1.3 XLE',
    plateNumber: 'ABC 1234',
    loanTerm: 60,
    paymentsMade: 5,
    monthlyPayment: 18500,
    totalLoanAmount: 1110000,
    startDate: '2025-10-15',
    paymentDueDay: 26,
    carImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'loan_city_2',
    carName: 'Honda City 1.5 RS',
    plateNumber: 'XYZ 5678',
    loanTerm: 60,
    paymentsMade: 25,
    monthlyPayment: 21000,
    totalLoanAmount: 1260000,
    startDate: '2024-05-10',
    paymentDueDay: 26,
    carImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'loan_xpander_3',
    carName: 'Mitsubishi Xpander Cross',
    plateNumber: 'DEF 9012',
    loanTerm: 60,
    paymentsMade: 45,
    monthlyPayment: 23500,
    totalLoanAmount: 1410000,
    startDate: '2022-11-20',
    paymentDueDay: 26,
    carImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
  }
]

export default function CarFinancing() {
  // Password Protection Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('car_financing_auth') === 'true'
  })
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting')

  // Load loans from localStorage first as immediate fallback
  const [carLoans, setCarLoans] = useState<CarLoanData[]>(() => {
    try {
      const saved = localStorage.getItem('car_financing_loans_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.error('Failed to parse saved car loans', e)
    }
    return DEFAULT_CAR_LOANS
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState<CarLoanData | null>(null)
  const [replacingImageLoanId, setReplacingImageLoanId] = useState<string | null>(null)

  // Fetch data from database API on mount
  const fetchFromDatabase = async () => {
    setDbStatus('connecting')
    try {
      const res = await fetch('/api/car-loans')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          // Compare with current local state to avoid overwriting newer local changes.
          // If the server data has equal or higher total paymentsMade, trust the server.
          // Otherwise, push local data TO the server (local is newer).
          const serverTotalPayments = data.reduce((sum: number, l: CarLoanData) => sum + (l.paymentsMade || 0), 0)
          const localTotalPayments = carLoans.reduce((sum, l) => sum + (l.paymentsMade || 0), 0)

          if (serverTotalPayments >= localTotalPayments) {
            // Server is same or ahead — use server data
            setCarLoans(data)
            localStorage.setItem('car_financing_loans_v1', JSON.stringify(data))
          } else {
            // Local is ahead (user clicked +1 Month but server didn't save yet) — push local to server
            try {
              await fetch('/api/car-loans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carLoans)
              })
            } catch { /* ignore push failure */ }
          }
        }
        setDbStatus('connected')
      } else {
        setDbStatus('offline')
      }
    } catch (e) {
      console.warn('Database server unreachable, using local cache', e)
      setDbStatus('offline')
    }
  }

  useEffect(() => {
    fetchFromDatabase()
  }, [])

  // Helper to persist updates to both Database API and localStorage
  const saveCarLoansToDb = async (newLoans: CarLoanData[]) => {
    setCarLoans(newLoans)
    try {
      localStorage.setItem('car_financing_loans_v1', JSON.stringify(newLoans))
      const res = await fetch('/api/car-loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLoans)
      })
      if (res.ok) {
        setDbStatus('connected')
      } else {
        setDbStatus('offline')
      }
    } catch (e) {
      console.error('Failed to post update to Database API', e)
      setDbStatus('offline')
    }
  }

  // Auth unlock handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'Password.123!') {
      sessionStorage.setItem('car_financing_auth', 'true')
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Incorrect password. Access denied.')
    }
  }

  // Auth lock handler
  const handleLock = () => {
    sessionStorage.removeItem('car_financing_auth')
    setIsAuthenticated(false)
    setPasswordInput('')
  }

  // Portfolio KPIs
  const portfolioSummary = useMemo(() => {
    let totalPortfolioValue = 0
    let totalAmountPaid = 0
    let totalRemainingBalance = 0
    let totalPaymentsMadeAll = 0
    let totalLoanTermsAll = 0

    carLoans.forEach(loan => {
      totalPortfolioValue += loan.totalLoanAmount
      const paid = loan.paymentsMade * loan.monthlyPayment
      totalAmountPaid += paid
      totalRemainingBalance += Math.max(0, loan.totalLoanAmount - paid)
      totalPaymentsMadeAll += loan.paymentsMade
      totalLoanTermsAll += loan.loanTerm
    })

    const overallPercentage = totalLoanTermsAll > 0 
      ? (totalPaymentsMadeAll / totalLoanTermsAll) * 100 
      : 0

    // Use the first active loan's context for the portfolio-level due date
    const firstLoan = carLoans[0]
    const upcomingDueDateInfo = firstLoan
      ? getNextPaymentDueDate(firstLoan.paymentDueDay || 26, firstLoan.startDate, firstLoan.paymentsMade, firstLoan.loanTerm)
      : getNextPaymentDueDate(26)

    return {
      totalActiveLoans: carLoans.length,
      totalPortfolioValue,
      totalAmountPaid,
      totalRemainingBalance,
      overallPercentage,
      nextDueDate: upcomingDueDateInfo.dateString,
      nextDueDaysRemaining: upcomingDueDateInfo.daysRemaining
    }
  }, [carLoans])

  // Handlers
  const handleSaveLoan = (savedLoan: CarLoanData) => {
    const exists = carLoans.some(item => item.id === savedLoan.id)
    const updated = exists 
      ? carLoans.map(item => item.id === savedLoan.id ? savedLoan : item)
      : [savedLoan, ...carLoans]

    saveCarLoansToDb(updated)
  }

  const handleDeleteLoan = (id: string) => {
    if (window.confirm('Are you sure you want to delete this car loan record?')) {
      const updated = carLoans.filter(loan => loan.id !== id)
      saveCarLoansToDb(updated)
    }
  }

  const handleUpdatePaymentsMade = (id: string, newPaymentsMade: number) => {
    const updated = carLoans.map(loan => {
      if (loan.id === id) {
        return {
          ...loan,
          paymentsMade: Math.min(loan.loanTerm, Math.max(0, newPaymentsMade))
        }
      }
      return loan
    })
    saveCarLoansToDb(updated)
  }

  const handleReplaceImage = (id: string, newBase64: string) => {
    const updated = carLoans.map(loan => {
      if (loan.id === id) {
        return { ...loan, carImage: newBase64 }
      }
      return loan
    })
    saveCarLoansToDb(updated)
    setReplacingImageLoanId(null)
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all car loans back to default demo vehicles?')) {
      saveCarLoansToDb(DEFAULT_CAR_LOANS)
    }
  }

  // RENDER LOCK SCREEN IF UNAUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20 min-h-[70vh] flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-3xl max-w-md w-full border border-white/15 bg-neutral-900/80 shadow-2xl relative overflow-hidden"
        >
          {/* Glowing gradient accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Protected Dashboard
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            Please enter the access password to view the Car Financing records.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setAuthError('')
                }}
                className="w-full rounded-2xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none pr-11 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                {authError}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-cyan-500 py-3 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-cyan-400 transition-all duration-200 hover:scale-[1.02] active-spring-scale shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Projects
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
      
      {/* NAVIGATION BACK LINK & TOP CONTROLS */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          {/* DATABASE SYNC STATUS BADGE */}
          <div
            onClick={fetchFromDatabase}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
              dbStatus === 'connected'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : dbStatus === 'connecting'
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title="Click to sync with Central Database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {dbStatus === 'connected'
                ? 'Database Synced (Cross-Device)'
                : dbStatus === 'connecting'
                ? 'Syncing Database...'
                : 'Local Cache Mode'}
            </span>
            <RefreshCw className={`w-3 h-3 ${dbStatus === 'connecting' ? 'animate-spin' : ''}`} />
          </div>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Demo Data
          </button>
          <button
            onClick={handleLock}
            className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-[11px] font-bold text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
            title="Lock page authentication"
          >
            <Unlock className="h-3.5 w-3.5 text-cyan-400" />
            Lock Page
          </button>
        </div>
      </div>

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-cyan-400 uppercase">
            <Car className="w-4 h-4" />
            Automotive Finance & Loan Tracker
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl text-white mt-2">
            Car Financing<span className="text-cyan-400">.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-xs md:text-sm text-neutral-400 leading-relaxed">
            Watch your car come to life as you pay your loan. Integrated with a central cross-device database to keep your vehicles and payment records synced on all devices.
          </p>
        </div>

        {/* PROMINENT ADD CAR LOAN BUTTON */}
        <button
          onClick={() => {
            setEditingLoan(null)
            setIsModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-black transition-all duration-200 hover:bg-cyan-400 hover:scale-105 active-spring-scale shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          + Add Car Loan
        </button>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="glass-card p-5 rounded-2xl border border-white/10 bg-neutral-900/40">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Vehicle Loans</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{portfolioSummary.totalActiveLoans}</div>
          <div className="text-[10px] text-neutral-500 mt-1">Vehicles under financing</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 bg-neutral-900/40">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Next Amortization Due</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-cyan-400">{portfolioSummary.nextDueDate}</div>
          <div className="text-[10px] text-cyan-300 font-bold mt-1">
            {portfolioSummary.nextDueDaysRemaining > 0
              ? `${portfolioSummary.nextDueDaysRemaining} days remaining`
              : portfolioSummary.nextDueDaysRemaining === 0
              ? 'Due today!'
              : `${Math.abs(portfolioSummary.nextDueDaysRemaining)} days overdue`}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 bg-neutral-900/40">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Amount Paid</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">₱{portfolioSummary.totalAmountPaid.toLocaleString()}</div>
          <div className="text-[10px] text-neutral-500 mt-1">
            ₱{portfolioSummary.totalRemainingBalance.toLocaleString()} remaining
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 bg-neutral-900/40">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Portfolio Progress</span>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{portfolioSummary.overallPercentage.toFixed(1)}%</div>
          {/* Micro Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${portfolioSummary.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* CAR LOANS LIST / GRID */}
      <div className="mt-10 space-y-12">
        {carLoans.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl border border-white/10 my-8">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-bold text-white">No Car Loans Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-6">
              You haven't added any car loans yet. Click the button below to add your first vehicle loan.
            </p>
            <button
              onClick={() => {
                setEditingLoan(null)
                setIsModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-xs font-extrabold uppercase text-black cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Add Car Loan
            </button>
          </div>
        ) : (
          carLoans.map((loan, index) => {
            const amountPaid = loan.paymentsMade * loan.monthlyPayment
            const remainingBalance = Math.max(0, loan.totalLoanAmount - amountPaid)
            const paymentPercentage = loan.loanTerm > 0 ? (loan.paymentsMade / loan.loanTerm) * 100 : 0
            const monthsRemaining = Math.max(0, loan.loanTerm - loan.paymentsMade)
            const dueInfo = getNextPaymentDueDate(loan.paymentDueDay || 26, loan.startDate, loan.paymentsMade, loan.loanTerm)

            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 bg-neutral-900/50 shadow-2xl relative overflow-hidden group"
              >
                {/* CARD HEADER & VEHICLE INFO */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                        {loan.carName}
                      </h2>
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-0.5 text-xs font-mono font-bold text-cyan-300">
                        {loan.plateNumber}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-2.5">
                      <span>Loan Start: <strong className="text-white">{loan.startDate}</strong></span>
                      <span>•</span>
                      <span>Term: <strong className="text-white">{loan.loanTerm} Months</strong></span>
                      <span>•</span>
                      <span className="text-cyan-400 font-bold">{monthsRemaining} Months Remaining</span>
                      <span>•</span>
                      <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Next Amortization: {dueInfo.dateString} ({dueInfo.daysRemaining > 0 ? `${dueInfo.daysRemaining} days` : dueInfo.daysRemaining === 0 ? 'Today!' : `${Math.abs(dueInfo.daysRemaining)} days overdue`})
                      </span>
                    </p>
                  </div>

                  {/* LOAN ACTION BUTTONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingLoan(loan)
                        setIsModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-bold text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteLoan(loan.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* MAIN VISUALIZATION & IMAGE REPLACEMENT */}
                {loan.carImage ? (
                  <CarProgressVisualization
                    image={loan.carImage}
                    percentage={paymentPercentage}
                    carName={loan.carName}
                    plateNumber={loan.plateNumber}
                    paymentsMade={loan.paymentsMade}
                    loanTerm={loan.loanTerm}
                    amountPaid={amountPaid}
                    remainingBalance={remainingBalance}
                    onUpdatePayments={(newVal) => handleUpdatePaymentsMade(loan.id, newVal)}
                    onReplaceImage={() => setReplacingImageLoanId(loan.id)}
                  />
                ) : (
                  <CarImageUploader
                    onImageSelected={(base64) => handleReplaceImage(loan.id, base64)}
                  />
                )}

                {/* MODAL FOR REPLACING IMAGE SPECIFIC TO THIS CAR */}
                {replacingImageLoanId === loan.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="bg-neutral-900 border border-white/15 p-6 rounded-3xl max-w-lg w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white">Replace Car Image for {loan.carName}</h3>
                        <button
                          onClick={() => setReplacingImageLoanId(null)}
                          className="text-neutral-400 hover:text-white text-xs font-bold"
                        >
                          Close
                        </button>
                      </div>
                      <CarImageUploader
                        onImageSelected={(base64) => handleReplaceImage(loan.id, base64)}
                      />
                    </div>
                  </div>
                )}

                {/* DETAILED LOAN BREAKDOWN GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Months Remaining</div>
                    <div className="text-sm font-extrabold text-cyan-400 mt-0.5">{monthsRemaining} Months</div>
                    <div className="text-[9px] text-neutral-500 font-mono">({loan.paymentsMade}/{loan.loanTerm} paid)</div>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
                    <div className="text-[10px] uppercase font-bold text-cyan-400">Next Amortization Due</div>
                    <div className="text-sm font-extrabold text-white mt-0.5">{dueInfo.dateString}</div>
                    <div className="text-[9px] text-cyan-300 font-mono font-bold">
                      {dueInfo.daysRemaining > 0
                        ? `Due in ${dueInfo.daysRemaining} days (${loan.paymentDueDay || 26}th)`
                        : dueInfo.daysRemaining === 0
                        ? `Due today! (${loan.paymentDueDay || 26}th)`
                        : `${Math.abs(dueInfo.daysRemaining)} days overdue (${loan.paymentDueDay || 26}th)`}
                    </div>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Monthly Amortization</div>
                    <div className="text-sm font-extrabold text-white mt-0.5">₱{loan.monthlyPayment.toLocaleString()}</div>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Total Financed</div>
                    <div className="text-sm font-extrabold text-white mt-0.5">₱{loan.totalLoanAmount.toLocaleString()}</div>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Total Amount Paid</div>
                    <div className="text-sm font-extrabold text-emerald-400 mt-0.5">₱{amountPaid.toLocaleString()}</div>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Remaining Balance</div>
                    <div className="text-sm font-extrabold text-amber-400 mt-0.5">₱{remainingBalance.toLocaleString()}</div>
                  </div>
                </div>

              </motion.div>
            )
          })
        )}
      </div>

      {/* ADD / EDIT CAR LOAN MODAL */}
      <CarLoanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLoan(null)
        }}
        onSave={handleSaveLoan}
        initialData={editingLoan}
      />
    </div>
  )
}
