"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Shield, Key, Users, Settings } from "lucide-react"

// Mock data
const mockPermissions = [
  // User Management
  { id: "users.create", name: "Create Users", description: "Ability to create new user accounts", category: "User Management", roleCount: 1, isSystem: true },
  { id: "users.edit", name: "Edit Users", description: "Ability to modify existing user accounts", category: "User Management", roleCount: 2, isSystem: true },
  { id: "users.delete", name: "Delete Users", description: "Ability to remove user accounts", category: "User Management", roleCount: 1, isSystem: true },
  { id: "users.view", name: "View Users", description: "Ability to view user accounts and their details", category: "User Management", roleCount: 3, isSystem: true },
  
  // Role Management
  { id: "roles.create", name: "Create Roles", description: "Ability to create new user roles", category: "Role Management", roleCount: 1, isSystem: true },
  { id: "roles.edit", name: "Edit Roles", description: "Ability to modify existing roles", category: "Role Management", roleCount: 1, isSystem: true },
  { id: "roles.delete", name: "Delete Roles", description: "Ability to remove roles", category: "Role Management", roleCount: 1, isSystem: true },
  { id: "roles.view", name: "View Roles", description: "Ability to view roles and their permissions", category: "Role Management", roleCount: 2, isSystem: true },
  
  // Permission Management
  { id: "permissions.manage", name: "Manage Permissions", description: "Ability to manage system permissions", category: "Permission Management", roleCount: 1, isSystem: true },
  
  // Product Management
  { id: "products.create", name: "Create Products", description: "Ability to add new products to the system", category: "Product Management", roleCount: 2, isSystem: false },
  { id: "products.edit", name: "Edit Products", description: "Ability to modify existing products", category: "Product Management", roleCount: 2, isSystem: false },
  { id: "products.delete", name: "Delete Products", description: "Ability to remove products from the system", category: "Product Management", roleCount: 1, isSystem: false },
  { id: "products.view", name: "View Products", description: "Ability to view products and their details", category: "Product Management", roleCount: 4, isSystem: false },
  
  // Transaction Management
  { id: "transactions.create", name: "Create Transactions", description: "Ability to create new transactions", category: "Transaction Management", roleCount: 3, isSystem: false },
  { id: "transactions.edit", name: "Edit Transactions", description: "Ability to modify existing transactions", category: "Transaction Management", roleCount: 2, isSystem: false },
  { id: "transactions.delete", name: "Delete Transactions", description: "Ability to remove transactions", category: "Transaction Management", roleCount: 1, isSystem: false },
  { id: "transactions.view", name: "View Transactions", description: "Ability to view transactions and their details", category: "Transaction Management", roleCount: 4, isSystem: false },
  
  // Reporting
  { id: "reports.view", name: "View Reports", description: "Ability to view system reports and analytics", category: "Reporting", roleCount: 4, isSystem: false },
  { id: "reports.export", name: "Export Reports", description: "Ability to export reports to various formats", category: "Reporting", roleCount: 2, isSystem: false },
  
  // System Settings
  { id: "settings.manage", name: "Manage Settings", description: "Ability to manage system settings and configuration", category: "System Settings", roleCount: 1, isSystem: true }
]

const categories = [
  "User Management",
  "Role Management", 
  "Permission Management",
  "Product Management",
  "Transaction Management",
  "Reporting",
  "System Settings",
  "Custom"
]

export function PermissionManager() {
  const [permissions, setPermissions] = useState(mockPermissions)
  const [selectedPermission, setSelectedPermission] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
    category: "",
    id: ""
  })

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || permission.category === filterCategory
    const matchesType = filterType === "all" || 
                       (filterType === "system" && permission.isSystem) ||
                       (filterType === "custom" && !permission.isSystem)
    return matchesSearch && matchesCategory && matchesType
  })

  const handleCreatePermission = () => {
    const permission = {
      ...newPermission,
      id: newPermission.id || `${newPermission.category.toLowerCase().replace(/\s+/g, '_')}.${newPermission.name.toLowerCase().replace(/\s+/g, '_')}`,
      roleCount: 0,
      isSystem: false
    }
    setPermissions([...permissions, permission])
    setNewPermission({ name: "", description: "", category: "", id: "" })
    setIsCreateDialogOpen(false)
  }

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission)
    setNewPermission({
      name: permission.name,
      description: permission.description,
      category: permission.category,
      id: permission.id
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePermission = () => {
    setPermissions(permissions.map(permission =>
      permission.id === selectedPermission.id ? { ...permission, ...newPermission } : permission
    ))
    setIsEditDialogOpen(false)
    setSelectedPermission(null)
    setNewPermission({ name: "", description: "", category: "", id: "" })
  }

  const handleDeletePermission = (permissionId) => {
    const permission = permissions.find(p => p.id === permissionId)
    if (permission && !permission.isSystem) {
      setPermissions(permissions.filter(permission => permission.id !== permissionId))
    }
  }

  const getPermissionsByCategory = () => {
    const categorized = {}
    filteredPermissions.forEach(permission => {
      if (!categorized[permission.category]) {
        categorized[permission.category] = []
      }
      categorized[permission.category].push(permission)
    })
    return categorized
  }

  const getPermissionBadge = (permission) => {
    if (permission.isSystem) {
      return <Badge variant="default">System</Badge>
    }
    return <Badge variant="secondary">Custom</Badge>
  }

  const getCategoryStats = () => {
    const stats = {}
    categories.forEach(category => {
      stats[category] = permissions.filter(p => p.category === category).length
    })
    return stats
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Permission Management</h2>
          <p className="text-muted-foreground">Manage system permissions and access controls</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Permission Name</Label>
                <Input
                  id="name"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                  placeholder="Enter permission name"
                />
              </div>
              <div>
                <Label htmlFor="id">Permission ID</Label>
                <Input
                  id="id"
                  value={newPermission.id}
                  onChange={(e) => setNewPermission({ ...newPermission, id: e.target.value })}
                  placeholder="e.g., products.create"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPermission.description}
                  onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
                  placeholder="Enter permission description"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPermission.category} onValueChange={(value) => setNewPermission({ ...newPermission, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreatePermission} className="w-full">
                Create Permission
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.filter(p => p.isSystem).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Permissions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.filter(p => !p.isSystem).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(getCategoryStats()).filter(cat => getCategoryStats()[cat] > 0).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="category">Category View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Permissions ({filteredPermissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">{permission.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">{permission.id}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{permission.category}</Badge>
                      </TableCell>
                      <TableCell>{getPermissionBadge(permission)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{permission.roleCount} roles</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPermission(permission)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {!permission.isSystem && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePermission(permission.id)}
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
        </TabsContent>

        <TabsContent value="category">
          <div className="space-y-4">
            {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category}
                    <Badge variant="outline">{categoryPermissions.length} permissions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{permission.name}</h4>
                            {getPermissionBadge(permission)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{permission.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-muted-foreground">ID: <code>{permission.id}</code></span>
                            <Badge variant="secondary">{permission.roleCount} roles</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPermission(permission)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {!permission.isSystem && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePermission(permission.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Permission Name</Label>
              <Input
                id="edit-name"
                value={newPermission.name}
                onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                disabled={selectedPermission?.isSystem}
              />
            </div>
            <div>
              <Label htmlFor="edit-id">Permission ID</Label>
              <Input
                id="edit-id"
                value={newPermission.id}
                onChange={(e) => setNewPermission({ ...newPermission, id: e.target.value })}
                disabled={selectedPermission?.isSystem}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newPermission.description}
                onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={newPermission.category} 
                onValueChange={(value) => setNewPermission({ ...newPermission, category: value })}
                disabled={selectedPermission?.isSystem}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdatePermission} className="w-full">
              Update Permission
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
