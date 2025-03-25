"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeComponentProps {
  data: string
}

export default function QRCodeComponent({ data }: QRCodeComponentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(data, {
          width: 250,
          margin: 1,
          color: {
            dark: "#FFFFFF",
            light: "#1E293B",
          },
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQRCode()
  }, [data])

  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `reservation-qr-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center">
      {qrCodeUrl ? (
        <>
          <div className="bg-slate-700 p-4 rounded-lg">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
          </div>
          <Button onClick={handleDownload} className="mt-4 bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Download size={16} />
            Descargar QR
          </Button>
        </>
      ) : (
        <div className="w-48 h-48 bg-slate-700 rounded-lg flex items-center justify-center">
          <p className="text-slate-400">Generando QR...</p>
        </div>
      )}
    </div>
  )
}

