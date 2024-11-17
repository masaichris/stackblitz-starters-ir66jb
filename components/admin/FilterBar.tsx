import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FilterBarProps {
  filters: {
    startDate: string
    endDate: string
    service: string
    debtStatus: string
  }
  onFilterChange: (name: string, value: string) => void
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
          placeholder="Start Date"
          className="w-full md:w-auto"
        />
        <Input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
          placeholder="End Date"
          className="w-full md:w-auto"
        />
        <Select 
          value={filters.service} 
          onValueChange={(value) => onFilterChange('service', value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Services</SelectItem>
            <SelectItem value="Halotel">Halotel</SelectItem>
            <SelectItem value="tiGO">tiGO</SelectItem>
            <SelectItem value="Vodacom">Vodacom</SelectItem>
            <SelectItem value="Airtel">Airtel</SelectItem>
            <SelectItem value="NMB">NMB</SelectItem>
            <SelectItem value="CRDB">CRDB</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={filters.debtStatus} 
          onValueChange={(value) => onFilterChange('debtStatus', value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Debt Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}