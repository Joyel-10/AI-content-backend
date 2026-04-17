import { Router } from 'express'
import { getHistory, saveBlog, deleteBlog } from '../controllers/history.controller'

const router = Router()
router.get('/', getHistory)
router.post('/', saveBlog)
router.delete('/:id', deleteBlog)

export default router
