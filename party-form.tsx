"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Calendar } from "lucide-react"
import type { Bill, TimeEntry } from "@/app/page"

interface PartyFormProps {
  onSave: (bill: Bill) => void
  onCancel: () => void
  initialBill?: Bill
  isEditMode?: boolean
}

export default function PartyForm({ onSave, onCancel, initialBill, isEditMode = false }: PartyFormProps) {
  const [partyName, setPartyName] = useState(initialBill?.partyName || "")
  const [address, setAddress] = useState(initialBill?.address || "")
  const [ratePerHour, setRatePerHour] = useState(initialBill?.ratePerHour || 900)
  const [paidAmount, setPaidAmount] = useState(initialBill?.paidAmount || 0)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialBill?.timeEntries || [{ date: "", hours: "" }])

  const addTimeEntry = () => {
    setTimeEntries([...timeEntries, { date: "", hours: "" }])
  }

  const removeTimeEntry = (index: number) => {
    if (timeEntries.length > 1) {
      setTimeEntries(timeEntries.filter((_, i) => i !== index))
    }
  }

  const updateTimeEntry = (index: number, field: "date" | "hours", value: string) => {
    const updated = [...timeEntries]
    updated[index][field] = value
    setTimeEntries(updated)
  }

  const calculateTotalHours = (): string => {
    let totalMinutes = 0

    timeEntries.forEach((entry) => {
      if (entry.hours) {
        const parts = entry.hours.split(":")
        const hours = Number.parseInt(parts[0] || "0")
        const minutes = Number.parseInt(parts[1] || "0")
        totalMinutes += hours * 60 + minutes
      }
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const seconds = 0

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const calculateTotalAmount = (): number => {
    const totalHours = calculateTotalHours()
    const parts = totalHours.split(":")
    const hours = Number.parseInt(parts[0])
    const minutes = Number.parseInt(parts[1])
    const totalHoursDecimal = hours + minutes / 60
    return Math.round(totalHoursDecimal * ratePerHour)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!partyName || !address) {
      alert("Please fill in party name and address")
      return
    }

    const validEntries = timeEntries.filter((e) => e.date && e.hours)
    if (validEntries.length === 0) {
      alert("Please add at least one time entry")
      return
    }

    const totalHours = calculateTotalHours()
    const totalAmount = calculateTotalAmount()
    const pendingPayment = totalAmount - paidAmount

    const bill: Bill = {
      id: isEditMode && initialBill ? initialBill.id : Date.now().toString(),
      partyName,
      address,
      timeEntries: validEntries,
      ratePerHour,
      totalHours,
      totalAmount,
      paidAmount,
      pendingPayment,
      createdAt: isEditMode && initialBill ? initialBill.createdAt : new Date().toISOString(),
    }

    onSave(bill)
  }

  const totalAmount = calculateTotalAmount()
  const pendingPayment = totalAmount - paidAmount

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="partyName">Party Name</Label>
          <Input
            id="partyName"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            placeholder="Enter party name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ratePerHour">Rate Per Hour (₹)</Label>
          <Input
            id="ratePerHour"
            type="number"
            value={ratePerHour}
            onChange={(e) => setRatePerHour(Number(e.target.value))}
            placeholder="900"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidAmount">Paid Amount (₹)</Label>
          <Input
            id="paidAmount"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Time Entries</Label>
          <Button type="button" onClick={addTimeEntry} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {timeEntries.map((entry, index) => (
            <Card key={index} className="p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-2">
                  <Label htmlFor={`date-${index}`} className="text-sm">
                    Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id={`date-${index}`}
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateTimeEntry(index, "date", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`hours-${index}`} className="text-sm">
                    Hours (HH:MM)
                  </Label>
                  <Input
                    id={`hours-${index}`}
                    type="time"
                    value={entry.hours}
                    onChange={(e) => updateTimeEntry(index, "hours", e.target.value)}
                    placeholder="08:30"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={() => removeTimeEntry(index)}
                    variant="destructive"
                    size="icon"
                    disabled={timeEntries.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-slate-50">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Total Hours:</span>
            <span className="font-mono">{calculateTotalHours()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Rate Per Hour:</span>
            <span>₹{ratePerHour}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total Amount:</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Paid Amount:</span>
            <span>₹{paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-red-600">
            <span>Pending Payment:</span>
            <span>₹{pendingPayment.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" size="lg">
          {isEditMode ? "Update Bill" : "Create Bill"}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" size="lg">
          Cancel
        </Button>
      </div>
    </form>
  )
}
