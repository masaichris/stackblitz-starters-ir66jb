'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import FilterBar from './admin/FilterBar'
import OverviewChart from './admin/OverviewChart'
import DataTable from './admin/DataTable'
import ReportGenerator from './admin/ReportGenerator'

interface AdminData {
  dailyBalances: Array<{
    date: string
    balance: number
  }>
  debts: Array<{
    name: string
    amount: number
    date: string
    paid: boolean
  }>
  commissions: Array<{
    service: string
    amount: number
    month: string
  }>
}

export default function AdminConsole() {
  const [data, setData] = useState<AdminData>({
    dailyBalances: [],
    debts: [],
    commissions: []
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    service: '',
    debtStatus: ''
  })

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams(filters).toString()
      const [balancesRes, debtsRes, commissionsRes] = await Promise.all([
        fetch(`/api/balances?${queryParams}`),
        fetch(`/api/debts?${queryParams}`),
        fetch(`/api/commissions?${queryParams}`)
      ])
      const [balancesData, debtsData, commissionsData] = await Promise.all([
        balancesRes.json(),
        debtsRes.json(),
        commissionsRes.json()
      ])
      setData({
        dailyBalances: balancesData,
        debts: debtsData,
        commissions: commissionsData
      })
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

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
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
      <h1 className="text-2xl font-bold">Admin Console</h1>
      
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewChart data={data.dailyBalances} />
        </TabsContent>

        <TabsContent value="debts">
          <DataTable
            title="Debt Overview"
            description="View all recorded debts"
            headers={['Name', 'Amount', 'Date', 'Status']}
            data={data.debts}
            renderCell={(row, key) => {
              switch (key) {
                case 'amount':
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(row.amount)
                case 'date':
                  return new Date(row.date).toLocaleDateString()
                case 'status':
                  return row.paid ? 'Paid' : 'Unpaid'
                default:
                  return row[key]
              }
            }}
          />
        </TabsContent>

        <TabsContent value="commissions">
          <DataTable
            title="Commission Overview"
            description="View all recorded commissions"
            headers={['Service', 'Amount', 'Month']}
            data={data.commissions}
            renderCell={(row, key) => {
              switch (key) {
                case 'amount':
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(row.amount)
                case 'month':
                  return new Date(row.month + '-01').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })
                default:
                  return row[key]
              }
            }}
          />
        </TabsContent>
      </Tabs>

      <ReportGenerator filters={filters} />
    </div>
  )
}