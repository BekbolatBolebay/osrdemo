"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Loader2, Copy, CheckCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface OCRResult {
  extractedText: string
  keyFields: {
    documentType?: string
    amount?: string
    date?: string
    recipient?: string
    accountNumber?: string
    [key: string]: string | undefined
  }
  confidence: number
  processingTime: number
}

type Language = "en" | "ru" | "kk"

const translations = {
  en: {
    title: "OCR Document Processing Demo",
    subtitle:
      "Upload your scanned documents (PDF, JPG, PNG) and extract structured data using advanced OCR technology.",
    uploadDocument: "Upload Document",
    supportedFormats: "Supported formats: PDF, JPG, PNG (Max size: 10MB)",
    selectFile: "Click to select a file or drag and drop",
    processDocument: "Process Document",
    processing: "Processing...",
    processingComplete: "Processing Complete",
    confidence: "Confidence",
    processingTime: "Processing Time",
    extractedText: "Extracted Text",
    keyFields: "Key Fields",
    jsonResult: "JSON Result",
    copyJson: "Copy JSON",
    copied: "Copied",
    invalidFileType: "Invalid file type",
    invalidFileDescription: "Please select a PDF, JPG, or PNG file.",
    copiedToClipboard: "Copied to clipboard",
    copiedDescription: "JSON result has been copied to your clipboard.",
    language: "Language",
  },
  ru: {
    title: "Демо OCR обработки документов",
    subtitle:
      "Загрузите отсканированные документы (PDF, JPG, PNG) и извлеките структурированные данные с помощью передовой технологии OCR.",
    uploadDocument: "Загрузить документ",
    supportedFormats: "Поддерживаемые форматы: PDF, JPG, PNG (Макс. размер: 10МБ)",
    selectFile: "Нажмите для выбора файла или перетащите",
    processDocument: "Обработать документ",
    processing: "Обработка...",
    processingComplete: "Обработка завершена",
    confidence: "Достоверность",
    processingTime: "Время обработки",
    extractedText: "Извлеченный текст",
    keyFields: "Ключевые поля",
    jsonResult: "JSON результат",
    copyJson: "Копировать JSON",
    copied: "Скопировано",
    invalidFileType: "Неверный тип файла",
    invalidFileDescription: "Пожалуйста, выберите файл PDF, JPG или PNG.",
    copiedToClipboard: "Скопировано в буфер",
    copiedDescription: "JSON результат скопирован в буфер обмена.",
    language: "Язык",
  },
  kk: {
    title: "OCR құжат өңдеу демосы",
    subtitle:
      "Сканерленген құжаттарыңызды (PDF, JPG, PNG) жүктеп, озық OCR технологиясын пайдаланып құрылымдалған деректерді алыңыз.",
    uploadDocument: "Құжат жүктеу",
    supportedFormats: "Қолдау көрсетілетін форматтар: PDF, JPG, PNG (Макс. өлшем: 10МБ)",
    selectFile: "Файл таңдау үшін басыңыз немесе сүйреп апарыңыз",
    processDocument: "Құжатты өңдеу",
    processing: "Өңдеу...",
    processingComplete: "Өңдеу аяқталды",
    confidence: "Сенімділік",
    processingTime: "Өңдеу уақыты",
    extractedText: "Алынған мәтін",
    keyFields: "Негізгі өрістер",
    jsonResult: "JSON нәтижесі",
    copyJson: "JSON көшіру",
    copied: "Көшірілді",
    invalidFileType: "Жарамсыз файл түрі",
    invalidFileDescription: "PDF, JPG немесе PNG файлын таңдаңыз.",
    copiedToClipboard: "Буферге көшірілді",
    copiedDescription: "JSON нәтижесі буферге көшірілді.",
    language: "Тіл",
  },
}

const languageNames = {
  en: "English",
  ru: "Русский",
  kk: "Қазақша",
}

export default function OCRDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const { toast } = useToast()

  const t = translations[language]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
      if (validTypes.includes(file.type)) {
        setSelectedFile(file)
        setResult(null)
      } else {
        toast({
          title: t.invalidFileType,
          description: t.invalidFileDescription,
          variant: "destructive",
        })
      }
    }
  }

  const processDocument = async () => {
    if (!selectedFile) return

    setIsProcessing(true)

    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock OCR result
    const mockResult: OCRResult = {
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

    setResult(mockResult)
    setIsProcessing(false)
  }

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      toast({
        title: t.copiedToClipboard,
        description: t.copiedDescription,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Globe className="h-4 w-4" />
                  {languageNames[language]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ru")}>Русский</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("kk")}>Қазақша</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h1 className="text-4xl font-bold text-foreground">{t.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-border hover:border-accent transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Upload className="h-6 w-6" />
              {t.uploadDocument}
            </CardTitle>
            <CardDescription>{t.supportedFormats}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-lg hover:bg-muted/50 transition-colors">
                  <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : t.selectFile}
                  </span>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button onClick={processDocument} disabled={isProcessing} className="bg-primary hover:bg-secondary">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t.processing}
                    </>
                  ) : (
                    t.processDocument
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  {t.processingComplete}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {t.copyJson}
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                {t.confidence}: {(result.confidence * 100).toFixed(1)}% | {t.processingTime}: {result.processingTime}s
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Extracted Text Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t.extractedText}</h3>
                <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{result.extractedText}</pre>
                </div>
              </div>

              {/* Key Fields */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t.keyFields}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.keyFields).map(([key, value]) => (
                    <div key={key} className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Output */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t.jsonResult}</h3>
                <div className="bg-card border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm font-mono text-card-foreground">{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
