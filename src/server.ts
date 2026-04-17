import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import generateRoute from './routes/generate.route'
import historyRoute from './routes/history.route'
import pdfRoute from './routes/pdf.route'

import { errorHandler } from './middleware/errorHandler'
import { generateLimiter, generalLimiter } from './middleware/rateLimit'

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-content-studio'


app.use(cors({
  origin: "*"
}))

app.use(express.json({ limit: '1mb' }))
app.use(generalLimiter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Routes (keep /api prefix)
app.use('/api/generate', generateLimiter, generateRoute)
app.use('/api/history', historyRoute)
app.use('/api/pdf', pdfRoute)

// Error handler
app.use(errorHandler)

// Connect DB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message)
    app.listen(PORT, () => {
      console.log(`Server running without DB on port ${PORT}`)
    })
  })

export default app