import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3001
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'car_loans.json')

// Default sample loans if DB file is brand new
const DEFAULT_LOANS = [
  {
    id: 'loan_civic_jeremiah',
    carName: 'Honda Civic RS Turbo (Jeremiah)',
    plateNumber: 'NAB 1748',
    loanTerm: 36,
    paymentsMade: 6,
    monthlyPayment: 25698,
    totalLoanAmount: 925128,
    startDate: '2026-04-27',
    paymentDueDay: 26,
    carImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
  },
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

// Ensure data directory and DB file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_LOANS, null, 2), 'utf-8')
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  // GET /api/car-loans
  if (req.method === 'GET' && url.pathname === '/api/car-loans') {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(data)
    } catch (err) {
      console.error('Failed to read database file', err)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Database read error' }))
    }
    return
  }

  // POST /api/car-loans
  if (req.method === 'POST' && url.pathname === '/api/car-loans') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        if (Array.isArray(parsed)) {
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8')
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, count: parsed.length }))
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Expected array of car loans' }))
        }
      } catch (err) {
        console.error('Failed to write database file', err)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
      }
    })
    return
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Endpoint not found' }))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Car Loans Database API server running on http://0.0.0.0:${PORT}`)
})
