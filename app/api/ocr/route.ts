import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock OCR processing result
    const result = {
      extractedText:
        "BANK STATEMENT\nAccount Number: 1234567890\nStatement Period: January 1, 2024 - January 31, 2024\nAccount Holder: John Doe\nBalance: $2,450.75\n\nTransactions:\n01/05/2024 - Deposit - $1,200.00\n01/10/2024 - ATM Withdrawal - $100.00\n01/15/2024 - Online Purchase - $45.25\n01/20/2024 - Direct Deposit - $2,500.00\n01/25/2024 - Utility Payment - $125.50",
      keyFields: {
        documentType: "Bank Statement",
        accountNumber: "1234567890",
        accountHolder: "John Doe",
        balance: "$2,450.75",
        statementPeriod: "January 1, 2024 - January 31, 2024",
      },
      confidence: 0.94,
      processingTime: 2.8,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("OCR processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
