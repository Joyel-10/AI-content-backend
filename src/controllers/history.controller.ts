import { Request, Response } from 'express'
import Blog from '../models/Blog.model'

export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const [blogs, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(),
    ])

    res.status(200).json({
      success: true,
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[History] Get error:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch history' })
  }
}

export async function saveBlog(req: Request, res: Response): Promise<void> {
  try {
    const { topic, tone, length, content, wordCount, readingTime, cinematicMode } = req.body

    if (!topic || !content) {
      res.status(400).json({ success: false, error: 'Topic and content are required' })
      return
    }

    const blog = await Blog.create({ topic, tone, length, content, wordCount, readingTime, cinematicMode })
    res.status(201).json({ success: true, blog })
  } catch (err) {
    console.error('[History] Save error:', err)
    res.status(500).json({ success: false, error: 'Failed to save blog' })
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const blog = await Blog.findByIdAndDelete(id)

    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog not found' })
      return
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' })
  } catch (err) {
    console.error('[History] Delete error:', err)
    res.status(500).json({ success: false, error: 'Failed to delete blog' })
  }
}
