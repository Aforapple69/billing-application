"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Users } from "lucide-react"
import PartyForm from "@/components/party-form"
import BillList from "@/components/bill-list"
import ViewBill from "@/components/view-bill"

export interface TimeEntry {
  date: string
  hours: string
}

export interface Bill {
  id: string
  partyName: string
  address: string
  timeEntries: TimeEntry[]
  ratePerHour: number
  totalHours: string
  totalAmount: number
  paidAmount: number
  pendingPayment: number
  createdAt: string
}

export default function Home() {
  const [activeView, setActiveView] = useState<"list" | "create" | "view" | "edit">("list")
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null)

  useEffect(() => {
    const storedBills = localStorage.getItem("bills")
    if (storedBills) {
      setBills(JSON.parse(storedBills))
    }
  }, [])

  const saveBill = (bill: Bill) => {
    const updatedBills = [...bills, bill]
    setBills(updatedBills)
    localStorage.setItem("bills", JSON.stringify(updatedBills))
    setActiveView("list")
  }

  const updateBill = (updatedBill: Bill) => {
    const updatedBills = bills.map((bill) => (bill.id === updatedBill.id ? updatedBill : bill))
    setBills(updatedBills)
    localStorage.setItem("bills", JSON.stringify(updatedBills))
    setActiveView("list")
  }

  const viewBill = (billId: string) => {
    setSelectedBillId(billId)
    setActiveView("view")
  }

  const editBill = (billId: string) => {
    setSelectedBillId(billId)
    setActiveView("edit")
  }

  const selectedBill = bills.find((b) => b.id === selectedBillId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Maruti Nandan Billing</h1>
          <p className="text-slate-600">Party billing and time tracking system</p>
        </div>

        {activeView === "list" && (
          <div>
            <div className="flex gap-4 mb-6">
              <Button onClick={() => setActiveView("create")} size="lg" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Bill
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  All Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bills.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No bills created yet</p>
                    <p className="text-sm mt-2">Click "Create New Bill" to get started</p>
                  </div>
                ) : (
                  <BillList bills={bills} onViewBill={viewBill} onEditBill={editBill} />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "create" && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Bill</CardTitle>
            </CardHeader>
            <CardContent>
              <PartyForm onSave={saveBill} onCancel={() => setActiveView("list")} />
            </CardContent>
          </Card>
        )}

        {activeView === "edit" && selectedBill && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Bill</CardTitle>
            </CardHeader>
            <CardContent>
              <PartyForm
                onSave={updateBill}
                onCancel={() => setActiveView("list")}
                initialBill={selectedBill}
                isEditMode={true}
              />
            </CardContent>
          </Card>
        )}

        {activeView === "view" && selectedBill && (
          <div>
            <Button onClick={() => setActiveView("list")} variant="outline" className="mb-4">
              ← Back to List
            </Button>
            <ViewBill bill={selectedBill} onEdit={() => editBill(selectedBill.id)} />
          </div>
        )}
      </div>
    </div>
  )
}
