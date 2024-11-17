import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DataTableProps {
  title: string
  description: string
  headers: string[]
  data: Record<string, any>[]
  renderCell: (row: Record<string, any>, key: string) => React.ReactNode
}

export default function DataTable({ 
  title, 
  description, 
  headers, 
  data, 
  renderCell 
}: DataTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left font-medium text-gray-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="px-4 py-2">
                      {renderCell(row, header.toLowerCase())}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td 
                    colSpan={headers.length} 
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}