import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface Debt {
  name: string
  amount: number
  date: string
  paid: boolean
}

interface DebtManagerProps {
  debts: Debt[]
  onAddDebt: (name: string, amount: number) => Promise<void>
  onPayDebt: (index: number) => Promise<void>
}

export default function DebtManager({ debts, onAddDebt, onPayDebt }: DebtManagerProps) {
  const [newDebt, setNewDebt] = useState({ name: '', amount: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newDebt.name || !newDebt.amount) return

    setIsSubmitting(true)
    try {
      await onAddDebt(newDebt.name, Number(newDebt.amount))
      setNewDebt({ name: '', amount: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debts</CardTitle>
        <CardDescription>Manage debts and repayments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {debts.map((debt, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{debt.name}</p>
                <p className="text-sm text-gray-500">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(debt.amount)}
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-200">
                    {debt.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </p>
              </div>
              {!debt.paid && (
                <Button 
                  variant="outline"
                  onClick={() => onPayDebt(index)}
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          ))}

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Add New Debt</h4>
            <div className="space-y-3">
              <Input
                placeholder="Debtor's Name"
                value={newDebt.name}
                onChange={(e) => setNewDebt(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Debt Amount"
                value={newDebt.amount}
                onChange={(e) => setNewDebt(prev => ({ ...prev, amount: e.target.value }))}
              />
              <Button 
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || !newDebt.name || !newDebt.amount}
              >
                {isSubmitting ? 'Adding...' : 'Add Debt'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}