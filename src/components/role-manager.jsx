"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Shield, Users, Settings } from "lucide-react"

// Mock data
const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    permissions: [
      "users.create", "users.edit", "users.delete", "users.view",
      "roles.create", "roles.edit", "roles.delete", "roles.view",
      "permissions.manage", "reports.view", "settings.manage",
      "products.create", "products.edit", "products.delete", "products.view",
      "transactions.create", "transactions.edit", "transactions.delete", "transactions.view"
    ],
    createdAt: "2024-01-01",
    isDefault: true
  },
  {
    id: 2,
    name: "Manager",
    description: "Management level access with limited administrative permissions",
    userCount: 5,
    permissions: [
      "users.view", "users.edit",
      "roles.view",
      "reports.view",
      "products.create", "products.edit", "products.view",
      "transactions.create", "transactions.edit", "transactions.view"
    ],
    createdAt: "2024-01-01",
    isDefault: true
  },
  {
    id: 3,
    name: "Employee",
    description: "Standard employee access for daily operations",
    userCount: 15,
    permissions: [
      "products.view",
      "transactions.create", "transactions.view",
      "reports.view"
    ],
    createdAt: "2024-01-01",
    isDefault: false
  },
  {
    id: 4,
    name: "Viewer",
    description: "Read-only access for monitoring and reporting",
    userCount: 3,
    permissions: [
      "products.view",
      "transactions.view",
      "reports.view"
    ],
    createdAt: "2024-01-01",
    isDefault: false
  }
]

const availablePermissions = [
  { id: "users.create", name: "Create Users", category: "User Management" },
  { id: "users.edit", name: "Edit Users", category: "User Management" },
  { id: "users.delete", name: "Delete Users", category: "User Management" },
  { id: "users.view", name: "View Users", category: "User Management" },
  { id: "roles.create", name: "Create Roles", category: "Role Management" },
  { id: "roles.edit", name: "Edit Roles", category: "Role Management" },
  { id: "roles.delete", name: "Delete Roles", category: "Role Management" },
  { id: "roles.view", name: "View Roles", category: "Role Management" },
  { id: "permissions.manage", name: "Manage Permissions", category: "Permission Management" },
  { id: "products.create", name: "Create Products", category: "Product Management" },
  { id: "products.edit", name: "Edit Products", category: "Product Management" },
  { id: "products.delete", name: "Delete Products", category: "Product Management" },
  { id: "products.view", name: "View Products", category: "Product Management" },
  { id: "transactions.create", name: "Create Transactions", category: "Transaction Management" },
  { id: "transactions.edit", name: "Edit Transactions", category: "Transaction Management" },
  { id: "transactions.delete", name: "Delete Transactions", category: "Transaction Management" },
  { id: "transactions.view", name: "View Transactions", category: "Transaction Management" },
  { id: "reports.view", name: "View Reports", category: "Reporting" },
  { id: "settings.manage", name: "Manage Settings", category: "System Settings" }
]

export function RoleManager() {
  const [roles, setRoles] = useState(mockRoles)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: []
  })

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateRole = () => {
    const role = {
      id: roles.length + 1,
      ...newRole,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false
    }
    setRoles([...roles, role])
    setNewRole({ name: "", description: "", permissions: [] })
    setIsCreateDialogOpen(false)
  }

  const handleEditRole = (role) => {
    setSelectedRole(role)
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRole = () => {
    setRoles(roles.map(role =>
      role.id === selectedRole.id ? { ...role, ...newRole } : role
    ))
    setIsEditDialogOpen(false)
    setSelectedRole(null)
    setNewRole({ name: "", description: "", permissions: [] })
  }

  const handleDeleteRole = (roleId) => {
    const role = roles.find(r => r.id === roleId)
    if (role && !role.isDefault) {
      setRoles(roles.filter(role => role.id !== roleId))
    }
  }

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId]
      })
    } else {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(p => p !== permissionId)
      })
    }
  }

  const getPermissionsByCategory = () => {
    const categories = {}
    availablePermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = []
      }
      categories[permission.category].push(permission)
    })
    return categories
  }

  const getRoleBadge = (role) => {
    if (role.isDefault) {
      return <Badge variant="default">Default</Badge>
    }
    return <Badge variant="secondary">Custom</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">Manage user roles and their permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="mt-2 space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
                  {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                            />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateRole} className="w-full">
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Roles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.filter(r => r.isDefault).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.userCount, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(role)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{role.createdAt}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      {!role.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                disabled={selectedRole?.isDefault}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
                {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                          />
                          <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleUpdateRole} className="w-full">
              Update Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
