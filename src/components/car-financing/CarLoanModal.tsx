import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, Car, Check, Calendar } from 'lucide-react'
import CarImageUploader from './CarImageUploader.tsx'

export interface CarLoanData {
  id: string
  carName: string
  plateNumber: string
  loanTerm: number
  paymentsMade: number
  monthlyPayment: number
  totalLoanAmount: number
  startDate: string
  paymentDueDay: number // e.g. 26th day of every month
  carImage: string
}

export function getNextPaymentDueDate(
  paymentDueDay: number = 26,
  startDate?: string,
  paymentsMade?: number,
  loanTerm?: number
): { dateString: string; daysRemaining: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // If we have loan context, calculate based on actual payment timeline
  if (startDate && paymentsMade !== undefined && loanTerm !== undefined) {
    // Loan fully paid
    if (paymentsMade >= loanTerm) {
      return { dateString: 'Fully Paid! 🎉', daysRemaining: 0 }
    }

    // The next payment number is paymentsMade + 1 (1-indexed).
    // Payment N is due N months after the start date, on the paymentDueDay.
    const start = new Date(startDate + 'T00:00:00')
    const nextPaymentNumber = paymentsMade + 1

    let targetYear = start.getFullYear()
    let targetMonth = start.getMonth() + nextPaymentNumber

    // Normalize month overflow
    targetYear += Math.floor(targetMonth / 12)
    targetMonth = targetMonth % 12

    // Clamp due day to actual days in the target month
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
    const actualDueDay = Math.min(paymentDueDay, daysInTargetMonth)

    const dueDate = new Date(targetYear, targetMonth, actualDueDay)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    return { dateString: formattedDate, daysRemaining }
  }

  // Fallback: simple "next Nth day" calculation (used when no loan context)
  let targetYear = today.getFullYear()
  let targetMonth = today.getMonth()

  if (today.getDate() > paymentDueDay) {
    targetMonth += 1
    if (targetMonth > 11) {
      targetMonth = 0
      targetYear += 1
    }
  }

  const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
  const actualDueDay = Math.min(paymentDueDay, daysInTargetMonth)

  const dueDate = new Date(targetYear, targetMonth, actualDueDay)
  dueDate.setHours(0, 0, 0, 0)

  const diffTime = dueDate.getTime() - today.getTime()
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return { dateString: formattedDate, daysRemaining }
}

interface CarLoanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (loan: CarLoanData) => void
  initialData?: CarLoanData | null
}

export default function CarLoanModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: CarLoanModalProps) {
  const [carName, setCarName] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [loanTerm, setLoanTerm] = useState<number>(60)
  const [paymentsMade, setPaymentsMade] = useState<number>(0)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(18500)
  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(1110000)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentDueDay, setPaymentDueDay] = useState<number>(26)
  const [carImage, setCarImage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setCarName(initialData.carName)
      setPlateNumber(initialData.plateNumber)
      setLoanTerm(initialData.loanTerm)
      setPaymentsMade(initialData.paymentsMade)
      setMonthlyPayment(initialData.monthlyPayment)
      setTotalLoanAmount(initialData.totalLoanAmount)
      setStartDate(initialData.startDate)
      setPaymentDueDay(initialData.paymentDueDay || 26)
      setCarImage(initialData.carImage || '')
    } else {
      setCarName('')
      setPlateNumber('')
      setLoanTerm(60)
      setPaymentsMade(0)
      setMonthlyPayment(18500)
      setTotalLoanAmount(1110000)
      setStartDate(new Date().toISOString().split('T')[0])
      setPaymentDueDay(26)
      setCarImage('')
    }
    setError('')
  }, [initialData, isOpen])

  // Calculated values
  const paymentsRemaining = Math.max(0, loanTerm - paymentsMade)
  const paymentPercentage = loanTerm > 0 ? (paymentsMade / loanTerm) * 100 : 0
  const amountPaid = paymentsMade * monthlyPayment
  const remainingBalance = Math.max(0, totalLoanAmount - amountPaid)
  const nextDueDateInfo = getNextPaymentDueDate(paymentDueDay, startDate, paymentsMade, loanTerm)

  // Auto-calculate monthly payment if total loan & term change
  const handleTotalLoanChange = (val: number) => {
    setTotalLoanAmount(val)
    if (loanTerm > 0) {
      setMonthlyPayment(Math.round(val / loanTerm))
    }
  }

  const handleLoanTermChange = (val: number) => {
    setLoanTerm(val)
    if (val > 0 && totalLoanAmount > 0) {
      setMonthlyPayment(Math.round(totalLoanAmount / val))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!carName.trim()) {
      setError('Please enter the vehicle car name / model.')
      return
    }
    if (!plateNumber.trim()) {
      setError('Please enter the vehicle plate number.')
      return
    }

    const loanRecord: CarLoanData = {
      id: initialData?.id || `loan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      carName: carName.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      loanTerm,
      paymentsMade,
      monthlyPayment,
      totalLoanAmount,
      startDate,
      paymentDueDay: paymentDueDay || 26,
      carImage: carImage || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    }

    onSave(loanRecord)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-neutral-900 border border-white/15 p-6 md:p-8 shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
                  {initialData ? 'Edit Car Loan' : 'Add New Car Loan'}
                </h2>
                <p className="text-xs text-neutral-400">Enter vehicle details and loan parameters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* SECTION 1: VEHICLE IMAGE */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                1. Vehicle Image (HD Upload)
              </label>
              {carImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-black">
                  <img src={carImage} alt="Vehicle Preview" className="h-full w-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCarImage('')}
                      className="rounded-full bg-black/80 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Remove / Change
                    </button>
                  </div>
                </div>
              ) : (
                <CarImageUploader
                  onImageSelected={(base64) => setCarImage(base64)}
                />
              )}
            </div>

            {/* SECTION 2: VEHICLE INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Car Name / Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Vios 1.3 XLE"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Plate Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC 1234"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* SECTION 3: LOAN INFORMATION */}
            <div className="border-t border-white/10 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                2. Loan Information & Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                    Total Loan Amount (₱)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={totalLoanAmount || ''}
                    onChange={(e) => handleTotalLoanChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                    Loan Term (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    step="1"
                    value={loanTerm || ''}
                    onChange={(e) => handleLoanTermChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                    Monthly Payment (₱)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={monthlyPayment || ''}
                    onChange={(e) => setMonthlyPayment(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                    Payments Made (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={loanTerm}
                    step="1"
                    value={paymentsMade}
                    onChange={(e) => setPaymentsMade(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl bg-neutral-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    Monthly Due Day (e.g. 26th)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    step="1"
                    value={paymentDueDay}
                    onChange={(e) => setPaymentDueDay(Math.min(31, Math.max(1, Number(e.target.value))))}
                    className="w-full rounded-xl bg-neutral-950 border border-cyan-500/30 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* AUTO CALCULATED SUMMARY PREVIEW */}
            <div className="rounded-2xl bg-neutral-950 border border-cyan-500/20 p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-500">Months Remaining</div>
                <div className="text-base font-extrabold text-white">{paymentsRemaining} months</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-500">Next Amortization Due</div>
                <div className="text-sm font-extrabold text-cyan-400">{nextDueDateInfo.dateString}</div>
                <div className="text-[9px] text-cyan-300 font-mono">({nextDueDateInfo.daysRemaining} days left)</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-500">Progress %</div>
                <div className="text-base font-extrabold text-cyan-400">{paymentPercentage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-500">Total Paid</div>
                <div className="text-base font-extrabold text-emerald-400">₱{amountPaid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-500">Remaining Balance</div>
                <div className="text-base font-extrabold text-amber-400">₱{remainingBalance.toLocaleString()}</div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400 transition-transform duration-200 hover:scale-105 active-spring-scale shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {initialData ? 'Save Changes' : 'Add Vehicle Loan'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
