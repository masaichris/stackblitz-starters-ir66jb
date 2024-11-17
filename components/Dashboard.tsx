'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import ServiceBalance from './dashboard/ServiceBalance'
import DebtManager from './dashboard/DebtManager'
import IncomeManager from './dashboard/IncomeManager'

interface Service {
  name: string
  balance: number
}

interface Debt {
  name: string
  amount: number
  date: string
  paid: boolean
}

interface Income {
  description: string
  amount: number
  date: string
}

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [cashAtHand, setCashAtHand] = useState(0)
  const [debts, setDebts] = useState<Debt[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, debtsRes, incomesRes] = await Promise.all([
        fetch('/api/balances'),
        fetch('/api/debts'),
        fetch('/api/incomes')
      ])

      if (!servicesRes.ok || !debtsRes.ok || !incomesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [servicesData, debtsData, incomesData] = await Promise.all([
        servicesRes.json(),
        debtsRes.json(),
        incomesRes.json()
      ])

      setServices(servicesData)
      setDebts(debtsData)
      setIncomes(incomesData)
      calculateTotalBalance(servicesData, debtsData, incomesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalBalance = (
    services: Service[],
    debts: Debt[],
    incomes: Income[],
    currentCash: number = cashAtHand
  ) => {
    const servicesTotal = services.reduce((sum, service) => sum + service.balance, 0)
    const debtsTotal = debts.reduce((sum, debt) => sum + (debt.paid ? 0 : debt.amount), 0)
    const incomesTotal = incomes.reduce((sum, income) => sum + income.amount, 0)
    setTotalBalance(servicesTotal + currentCash - debtsTotal + incomesTotal)
  }

  const handleServiceBalanceChange = async (index: number, value: number) => {
    try {
      const updatedServices = [...services]
      updatedServices[index].balance = value
      const response = await fetch('/api/balances', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedServices[index])
      })
      if (!response.ok) throw new Error('Failed to update service balance')
      setServices(updatedServices)
      calculateTotalBalance(updatedServices, debts, incomes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service balance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCashAtHandChange = (value: number) => {
    setCashAtHand(value)
    calculateTotalBalance(services, debts, incomes, value)
  }

  const handleAddDebt = async (name: string, amount: number) => {
    try {
      const newDebt = { name, amount, date: new Date().toISOString(), paid: false }
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDebt)
      })
      if (!response.ok) throw new Error('Failed to add debt')
      const addedDebt = await response.json()
      setDebts([...debts, addedDebt])
      calculateTotalBalance(services, [...debts, addedDebt], incomes)
      toast({
        title: "Success",
        description: "Debt added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add debt. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleAddIncome = async (description: string, amount: number) => {
    try {
      const newIncome = { description, amount, date: new Date().toISOString() }
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncome)
      })
      if (!response.ok) throw new Error('Failed to add income')
      const addedIncome = await response.json()
      setIncomes([...incomes, addedIncome])
      calculateTotalBalance(services, debts, [...incomes, addedIncome])
      toast({
        title: "Success",
        description: "Income added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add income. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handlePayDebt = async (index: number) => {
    try {
      const updatedDebts = [...debts]
      updatedDebts[index].paid = true
      const response = await fetch(`/api/debts/${updatedDebts[index]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDebts[index])
      })
      if (!response.ok) throw new Error('Failed to update debt')
      setDebts(updatedDebts)
      await handleAddIncome(
        `Debt repayment from ${updatedDebts[index].name}`,
        updatedDebts[index].amount
      )
      toast({
        title: "Success",
        description: "Debt marked as paid",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark debt as paid. Please try again.",
        variant: "destructive",
      })
      throw error
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mobile Money Management Dashboard</h1>
      <Tabs defaultValue="balances">
        <TabsList>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
          <TabsTrigger value="incomes">Incomes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="balances">
          <ServiceBalance
            services={services}
            cashAtHand={cashAtHand}
            totalBalance={totalBalance}
            onServiceBalanceChange={handleServiceBalanceChange}
            onCashAtHandChange={handleCashAtHandChange}
          />
        </TabsContent>
        
        <TabsContent value="debts">
          <DebtManager
            debts={debts}
            onAddDebt={handleAddDebt}
            onPayDebt={handlePayDebt}
          />
        </TabsContent>
        
        <TabsContent value="incomes">
          <IncomeManager
            incomes={incomes}
            onAddIncome={handleAddIncome}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}