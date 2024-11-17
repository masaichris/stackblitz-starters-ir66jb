'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const SERVICES = ['Halotel', 'tiGO', 'Vodacom', 'Airtel', 'NMB', 'CRDB'] as const
type Service = typeof SERVICES[number]

interface Commission {
  id: string
  service: Service
  amount: number
  month: string
  createdAt: string
}

interface FormData {
  service: Service
  amount: string
  month: string
}

export default function Commissions() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    service: SERVICES[0],
    amount: '',
    month: new Date().toISOString().slice(0, 7)
  })

  useEffect(() => {
    fetchCommissions()
  }, [])

  const fetchCommissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/commissions')
      if (!response.ok) throw new Error('Failed to fetch commissions')
      const data = await response.json()
      setCommissions(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch commissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.service || !formData.amount || !formData.month) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: formData.service,
          amount: parseFloat(formData.amount),
          month: formData.month
        })
      })

      if (!response.ok) throw new Error('Failed to add commission')
      
      const newCommission = await response.json()
      setCommissions(prev => [...prev, newCommission])
      
      // Reset form
      setFormData({
        service: SERVICES[0],
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      })

      toast({
        title: "Success",
        description: "Commission added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add commission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Monthly Commissions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Commission</CardTitle>
          <CardDescription>Record monthly commissions for each service</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => handleInputChange('service', value as Service)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="month"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Commission'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Records</CardTitle>
          <CardDescription>View all recorded commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-left">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{commission.service}</td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(commission.amount)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(commission.month + '-01').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No commissions recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}