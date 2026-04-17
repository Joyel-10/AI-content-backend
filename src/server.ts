import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import generateRoute from './routes/generate.route'
import historyRoute from './routes/history.route'
import { errorHandler } from './middleware/errorHandler'
import { generateLimiter, generalLimiter } from './middleware/rateLimit'
import pdfRoute from "./routes/pdf.route"

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-content-studio'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(generalLimiter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Routes
app.use('/api/generate', generateLimiter, generateRoute)
app.use('/api/history', historyRoute)

// Error handler
app.use(errorHandler)

app.use("/api/pdf", pdfRoute)

// Connect DB and start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected')
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`)
      console.log(` Frontend: ${FRONTEND_URL}`)
    })
  })
  .catch(err => {
    console.error(' MongoDB connection failed:', err.message)
    console.log('  Starting without DB — history features disabled')
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT} (no DB)`)
    })
  })

export default app
