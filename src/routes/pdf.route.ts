const PDFDocument = require("pdfkit")
import { Router } from "express"

const router = Router()

router.post("/", (req, res) => {
  const { content } = req.body

  if (!content) {
    return res.status(400).json({ error: "No content provided" })
  }

  const doc = new PDFDocument({ margin: 50 })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=blog.pdf")

  doc.pipe(res)

  //  Title
  doc
    .fontSize(20)
    .text("AI Generated Blog", { align: "center" })
    .moveDown(2)

  //  Split content into lines
  const lines = content.split("\n")

  lines.forEach((line: string) => {
    // Detect headings (simple logic)
    if (
      line.toLowerCase().includes("introduction") ||
      line.toLowerCase().includes("conclusion") ||
      line.endsWith(":")
    ) {
      doc
        .fontSize(14)
        .fillColor("black")
        .text(line, { bold: true })
        .moveDown()
    } else {
      doc
        .fontSize(12)
        .fillColor("black")
        .text(line, {
          align: "left",
          lineGap: 4,
        })
        .moveDown()
    }
  })

  doc.end()
})

export default router