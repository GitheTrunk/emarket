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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

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
