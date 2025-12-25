"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Edit } from "lucide-react"
import type { Bill } from "@/app/page"

interface BillListProps {
  bills: Bill[]
  onViewBill: (billId: string) => void
  onEditBill: (billId: string) => void
}

export default function BillList({ bills, onViewBill, onEditBill }: BillListProps) {
  const sortedBills = [...bills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-4">
      {sortedBills.map((bill) => (
        <Card key={bill.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <h3 className="text-xl font-semibold text-slate-900">{bill.partyName}</h3>
              </div>

              <p className="text-slate-600 mb-3">{bill.address}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Total Hours</p>
                  <p className="font-mono font-semibold">{bill.totalHours}</p>
                </div>
                <div>
                  <p className="text-slate-500">Total Amount</p>
                  <p className="font-semibold">₹{bill.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Paid</p>
                  <p className="font-semibold text-green-600">₹{bill.paidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Pending</p>
                  <p className="font-semibold text-red-600">₹{bill.pendingPayment.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(bill.createdAt).toLocaleDateString("en-IN")}</span>
                <span>•</span>
                <span>{bill.timeEntries.length} entries</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onEditBill(bill.id)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => onViewBill(bill.id)} variant="outline" size="sm">
                View Bill
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
