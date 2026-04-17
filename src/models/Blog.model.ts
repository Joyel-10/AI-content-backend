import mongoose, { Schema, Document } from 'mongoose'

export interface IBlog extends Document {
  topic: string
  tone: string
  length: 'short' | 'medium' | 'long'
  content: string
  wordCount: number
  readingTime: number
  cinematicMode: boolean
  language: string 
  createdAt: Date
}

const BlogSchema = new Schema<IBlog>({
  topic: { type: String, required: true, trim: true },
  tone: { type: String, required: true },
  length: { type: String, enum: ['short', 'medium', 'long'], default: 'medium' },
  content: { type: String, required: true },
  wordCount: { type: Number, default: 0 },
  readingTime: { type: Number, default: 1 },
  cinematicMode: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
  createdAt: { type: Date, default: Date.now },
})

BlogSchema.index({ createdAt: -1 })

export default mongoose.model<IBlog>('Blog', BlogSchema)
