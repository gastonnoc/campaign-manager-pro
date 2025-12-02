import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const campaignId = formData.get("campaignId") as string
    const fileType = formData.get("fileType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB" }, { status: 413 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf", "image/svg+xml"]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed types: JPG, PNG, GIF, PDF, SVG" }, { status: 400 })
    }

    const mockUrl = `/uploads/${fileType}/${file.name}`

    return NextResponse.json(
      {
        url: mockUrl,
        key: `${fileType}/${campaignId}/${file.name}`,
        size: file.size,
        contentType: file.type,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
