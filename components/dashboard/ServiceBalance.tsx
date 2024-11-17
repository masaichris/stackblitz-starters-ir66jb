import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Service {
  name: string
  balance: number
}

interface ServiceBalanceProps {
  services: Service[]
  cashAtHand: number
  totalBalance: number
  onServiceBalanceChange: (index: number, value: number) => void
  onCashAtHandChange: (value: number) => void
}

export default function ServiceBalance({
  services,
  cashAtHand,
  totalBalance,
  onServiceBalanceChange,
  onCashAtHandChange,
}: ServiceBalanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Balances</CardTitle>
        <CardDescription>Enter the opening balances for each service</CardDescription>
      </CardHeader>
      <CardContent>
        {services.map((service, index) => (
          <div key={service.name} className="mb-4">
            <Label htmlFor={service.name}>{service.name}</Label>
            <Input
              id={service.name}
              type="number"
              value={service.balance}
              onChange={(e) => onServiceBalanceChange(index, Number(e.target.value))}
            />
          </div>
        ))}
        <div className="mb-4">
          <Label htmlFor="cashAtHand">Cash at Hand</Label>
          <Input
            id="cashAtHand"
            type="number"
            value={cashAtHand}
            onChange={(e) => onCashAtHandChange(Number(e.target.value))}
          />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold">
          Total Balance: {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(totalBalance)}
        </p>
      </CardFooter>
    </Card>
  )
}