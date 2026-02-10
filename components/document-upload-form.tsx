"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentUploadFormProps {
  entryId: string
  onComplete?: () => void
}

export function DocumentUploadForm({ entryId, onComplete }: DocumentUploadFormProps) {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    vehicle: false,
    driver: false,
    permit: false,
    goods: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileUpload = (docType: string) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: true,
    }))
  }

  const allUploaded = Object.values(uploadedDocs).every((v) => v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allUploaded) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete?.()
    }, 1000)
  }

  const documents = [
    { id: "vehicle", label: "Vehicle Photo", description: "Clear photo of vehicle" },
    { id: "driver", label: "Driver License", description: "Valid driver identification" },
    { id: "permit", label: "Transport Permit", description: "Active transport permit" },
    { id: "goods", label: "Goods Photo", description: "Sugar cane load documentation" },
  ]

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle>Document Upload for Entry {entryId}</CardTitle>
        <CardDescription>Upload all required documents for verification</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 border border-dashed border-border/50 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{doc.label}</p>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                  </div>
                  {uploadedDocs[doc.id] && <span className="text-lg">✓</span>}
                </div>

                <button
                  type="button"
                  onClick={() => handleFileUpload(doc.id)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    uploadedDocs[doc.id]
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/30"
                  }`}
                >
                  {uploadedDocs[doc.id] ? "✓ Uploaded" : "Upload File"}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!allUploaded || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Entry for Verification"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
