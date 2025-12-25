"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Printer, Edit } from "lucide-react"
import type { Bill } from "@/app/page"

interface ViewBillProps {
  bill: Bill
  onEdit: () => void
}

export default function ViewBill({ bill, onEdit }: ViewBillProps) {
  const billRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  return (
    <div>
      <div className="mb-4 print:hidden flex gap-3">
        <Button onClick={onEdit} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Edit className="w-4 h-4" />
          Edit Bill
        </Button>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="w-4 h-4" />
          Print Bill
        </Button>
      </div>

      <Card ref={billRef} className="p-8 max-w-4xl mx-auto bg-white print:shadow-none">
        <div className="border-4 border-slate-900 p-8">
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-slate-900 pb-4">
            <h1 className="text-4xl font-bold text-red-600">MARUTI NANDAN</h1>
          </div>

          {/* Party Details */}
          <div className="mb-6">
            <div className="border-2 border-slate-900 p-3">
              <p className="text-lg font-semibold">PARTY NAME: {bill.partyName.toUpperCase()}</p>
            </div>
            <div className="border-2 border-slate-900 border-t-0 p-3">
              <p className="text-lg font-semibold">ADD: {bill.address.toUpperCase()}</p>
            </div>
          </div>

          {/* Time Entries Table */}
          <div className="mb-6">
            <table className="w-full border-2 border-slate-900">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="border-r-2 border-slate-900 p-3 text-center font-bold">DATE</th>
                  <th className="p-3 text-center font-bold">TOTAL HOURS</th>
                </tr>
              </thead>
              <tbody>
                {bill.timeEntries.map((entry, index) => (
                  <tr key={index} className="border-b-2 border-slate-900">
                    <td className="border-r-2 border-slate-900 p-3 text-center">{formatDate(entry.date)}</td>
                    <td className="p-3 text-center">{entry.hours}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border-r-2 border-slate-900 p-3 text-center">TOTAL</td>
                  <td className="p-3 text-center">{bill.totalHours}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Billing Summary */}
          <div className="mt-6">
            <table className="w-full border-2 border-slate-900">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="border-r-2 border-slate-900 p-3 text-center font-bold">TOTAL HOURS</th>
                  <th className="border-r-2 border-slate-900 p-3 text-center font-bold">RATE PER HOUR</th>
                  <th className="p-3 text-center font-bold">TOTAL AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-slate-900">
                  <td className="border-r-2 border-slate-900 p-3 text-center">{bill.totalHours}</td>
                  <td className="border-r-2 border-slate-900 p-3 text-center">{bill.ratePerHour}</td>
                  <td className="p-3 text-center">{bill.totalAmount.toLocaleString()}</td>
                </tr>
                <tr className="border-b-2 border-slate-900">
                  <td colSpan={2} className="border-r-2 border-slate-900 p-3 text-center font-bold">
                    PAID (DIESEL)
                  </td>
                  <td className="p-3 text-center">{bill.paidAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border-r-2 border-slate-900 p-3 text-center font-bold">
                    PENDING PAYMENT
                  </td>
                  <td className="p-3 text-center text-red-600 font-bold">{bill.pendingPayment.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
