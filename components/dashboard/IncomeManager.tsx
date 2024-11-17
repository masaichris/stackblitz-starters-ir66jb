import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface Income {
  description: string
  amount: number
  date: string
}

interface IncomeManagerProps {
  incomes: Income[]
  onAddIncome: (description: string, amount: number) => Promise<void>
}

export default function IncomeManager({ incomes, onAddIncome }: IncomeManagerProps) {
  const [newIncome, setNewIncome] = useState({ description: '', amount: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newIncome.description || !newIncome.amount) return

    setIsSubmitting(true)
    try {
      await onAddIncome(newIncome.description, Number(newIncome.amount))
      setNewIncome({ description: '', amount: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incomes</CardTitle>
        <CardDescription>Record additional incomes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incomes.map((income, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{income.description}</span>
                <span className="text-green-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(income.amount)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(income.date).toLocaleDateString()}
              </p>
            </div>
          ))}

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Add New Income</h4>
            <div className="space-y-3">
              <Input
                placeholder="Income Description"
                value={newIncome.description}
                onChange={(e) => setNewIncome(prev => ({ ...prev, description: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Income Amount"
                value={newIncome.amount}
                onChange={(e) => setNewIncome(prev => ({ ...prev, amount: e.target.value }))}
              />
              <Button 
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || !newIncome.description || !newIncome.amount}
              >
                {isSubmitting ? 'Adding...' : 'Add Income'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}