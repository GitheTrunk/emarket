import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = config.port
const NODE_ENV = config.nodeEnv

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true
  })
)

// JSON and URL-encoded body parser with reasonable limits
// Images are handled via Supabase Storage, not in request body
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Request logging (silent by default; enable via REQUEST_LOG=on)
const shouldLogRequests = (process.env.REQUEST_LOG || '').toLowerCase() === 'on'
const logSkipPrefixes = ['/api/wishlist/check', '/api/wishlist', '/api/cart']

if (shouldLogRequests) {
  app.use((req, res, next) => {
    // Skip very chatty endpoints
    if (logSkipPrefixes.some((p) => req.path.startsWith(p))) return next()
    if (req.method === 'OPTIONS') return next()
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

// Routes
app.use('/api', apiRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║       EMarket Backend Server          ║
╠═══════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(31)}║
║ Port: ${String(PORT).padEnd(36)}║
║ CORS: ${(process.env.CORS_ORIGIN || 'http://localhost:5173').padEnd(30)}║
╚═══════════════════════════════════════╝
  `)
})
