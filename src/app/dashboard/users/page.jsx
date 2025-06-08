"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManager } from "@/components/user-manager"

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManager />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
