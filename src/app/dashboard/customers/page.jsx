import { UsersIcon } from "lucide-react"
import { CustomerManager } from "@/components/customer-manager"

export default function CustomersPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Customers</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <CustomerManager />
      </div>
    </div>
  )
}