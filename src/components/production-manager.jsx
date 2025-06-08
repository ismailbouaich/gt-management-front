"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Package,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Factory,
  Beaker,
  Scale,
  Timer,
  BookOpen,
  BarChart3,
  DollarSign,
} from "lucide-react"

// Mock data for production
const mockProductionOrders = [
  {
    id: 1,
    orderNumber: "PRD-001",
    productName: "Vanilla Cupcakes",
    batchSize: 100,
    status: "In Progress",
    priority: "High",
    startDate: "2024-12-08",
    dueDate: "2024-12-10",
    assignedTo: "Baker Team A",
    progress: 65,
    recipe: "RCP-001",
    estimatedTime: 8,
    actualTime: 5.2,
    materials: ["Flour", "Sugar", "Eggs", "Vanilla Extract"],
    cost: 250.00,
  },
  {
    id: 2,
    orderNumber: "PRD-002",
    productName: "Moisturizing Cream",
    batchSize: 50,
    status: "Completed",
    priority: "Medium",
    startDate: "2024-12-07",
    dueDate: "2024-12-08",
    assignedTo: "Production Team B",
    progress: 100,
    recipe: "RCP-002",
    estimatedTime: 6,
    actualTime: 5.8,
    materials: ["Base Cream", "Essential Oils", "Preservatives"],
    cost: 180.00,
  },
  {
    id: 3,
    orderNumber: "PRD-003",
    productName: "Artisan Bread",
    batchSize: 200,
    status: "Pending",
    priority: "Low",
    startDate: "2024-12-09",
    dueDate: "2024-12-11",
    assignedTo: "Baker Team C",
    progress: 0,
    recipe: "RCP-003",
    estimatedTime: 12,
    actualTime: 0,
    materials: ["Flour", "Yeast", "Salt", "Water"],
    cost: 120.00,
  },
]

const mockRecipes = [
  {
    id: 1,
    code: "RCP-001",
    name: "Vanilla Cupcakes",
    category: "Bakery",
    batchSize: 100,
    prepTime: 30,
    cookTime: 25,
    totalTime: 55,
    difficulty: "Easy",
    ingredients: [
      { name: "All-purpose flour", quantity: 2, unit: "cups" },
      { name: "Sugar", quantity: 1.5, unit: "cups" },
      { name: "Eggs", quantity: 2, unit: "pieces" },
      { name: "Vanilla extract", quantity: 1, unit: "tsp" },
      { name: "Baking powder", quantity: 2, unit: "tsp" },
      { name: "Milk", quantity: 1, unit: "cup" },
    ],
    instructions: [
      "Preheat oven to 350°F",
      "Mix dry ingredients",
      "Combine wet ingredients",
      "Fold together until just combined",
      "Bake for 20-25 minutes",
    ],
    cost: 2.50,
    notes: "Do not overmix to avoid tough cupcakes",
  },
  {
    id: 2,
    code: "RCP-002",
    name: "Moisturizing Cream",
    category: "Cosmetics",
    batchSize: 50,
    prepTime: 45,
    cookTime: 0,
    totalTime: 45,
    difficulty: "Medium",
    ingredients: [
      { name: "Base cream", quantity: 500, unit: "ml" },
      { name: "Jojoba oil", quantity: 30, unit: "ml" },
      { name: "Vitamin E oil", quantity: 5, unit: "ml" },
      { name: "Essential oils", quantity: 10, unit: "drops" },
      { name: "Preservative", quantity: 2, unit: "ml" },
    ],
    instructions: [
      "Heat base cream to room temperature",
      "Add oils one by one while mixing",
      "Add preservative last",
      "Mix thoroughly for 5 minutes",
      "Test consistency and adjust",
    ],
    cost: 3.60,
    notes: "Ensure all equipment is sterilized",
  },
]

const mockQualityChecks = [
  {
    id: 1,
    productionId: 1,
    checkPoint: "Visual Inspection",
    status: "Passed",
    checkedBy: "QA Team",
    timestamp: "2024-12-08 14:30",
    notes: "Color and texture look good",
  },
  {
    id: 2,
    productionId: 1,
    checkPoint: "Weight Check",
    status: "Passed",
    checkedBy: "QA Team",
    timestamp: "2024-12-08 15:00",
    notes: "Average weight within tolerance",
  },
]

export function ProductionManager() {
  const [activeTab, setActiveTab] = useState("orders")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState(mockProductionOrders)
  const [recipes, setRecipes] = useState(mockRecipes)
  const [qualityChecks, setQualityChecks] = useState(mockQualityChecks)

  // Form states for creating new production order
  const [newOrder, setNewOrder] = useState({
    productName: "",
    batchSize: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
    recipe: "",
    estimatedTime: "",
    notes: "",
  })

  // Form states for creating new recipe
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    category: "",
    batchSize: "",
    prepTime: "",
    cookTime: "",
    difficulty: "Easy",
    ingredients: [{ name: "", quantity: "", unit: "" }],
    instructions: [""],
    notes: "",
  })

  // Filter production orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateOrder = () => {
    const order = {
      id: orders.length + 1,
      orderNumber: `PRD-${String(orders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      status: "Pending",
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      actualTime: 0,
      cost: 0,
    }
    
    setOrders([...orders, order])
    setNewOrder({
      productName: "",
      batchSize: "",
      priority: "Medium",
      dueDate: "",
      assignedTo: "",
      recipe: "",
      estimatedTime: "",
      notes: "",
    })
    setShowCreateForm(false)
  }

  const handleCreateRecipe = () => {
    const recipe = {
      id: recipes.length + 1,
      code: `RCP-${String(recipes.length + 1).padStart(3, '0')}`,
      ...newRecipe,
      totalTime: parseInt(newRecipe.prepTime) + parseInt(newRecipe.cookTime),
      cost: 0, // Calculate based on ingredients
    }
    
    setRecipes([...recipes, recipe])
    setNewRecipe({
      name: "",
      category: "",
      batchSize: "",
      prepTime: "",
      cookTime: "",
      difficulty: "Easy",
      ingredients: [{ name: "", quantity: "", unit: "" }],
      instructions: [""],
      notes: "",
    })
  }

  const addIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: "", quantity: "", unit: "" }]
    })
  }

  const updateIngredient = (index, field, value) => {
    const updated = [...newRecipe.ingredients]
    updated[index][field] = value
    setNewRecipe({ ...newRecipe, ingredients: updated })
  }

  const removeIngredient = (index) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter((_, i) => i !== index)
    })
  }

  const addInstruction = () => {
    setNewRecipe({
      ...newRecipe,
      instructions: [...newRecipe.instructions, ""]
    })
  }

  const updateInstruction = (index, value) => {
    const updated = [...newRecipe.instructions]
    updated[index] = value
    setNewRecipe({ ...newRecipe, instructions: updated })
  }

  const removeInstruction = (index) => {
    setNewRecipe({
      ...newRecipe,
      instructions: newRecipe.instructions.filter((_, i) => i !== index)
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "default"
      case "In Progress": return "outline"
      case "Pending": return "secondary"
      case "On Hold": return "destructive"
      default: return "secondary"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "outline"
      case "Low": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Production Management</h2>
          <p className="text-muted-foreground">
            Manage production orders, recipes, and quality control
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Production Order
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Production Orders</TabsTrigger>
          <TabsTrigger value="recipes">Recipes & Formulas</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {showCreateForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Production Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={newOrder.productName}
                      onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={newOrder.batchSize}
                      onChange={(e) => setNewOrder({ ...newOrder, batchSize: e.target.value })}
                      placeholder="Enter batch size"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({ ...newOrder, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newOrder.dueDate}
                      onChange={(e) => setNewOrder({ ...newOrder, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={newOrder.assignedTo} onValueChange={(value) => setNewOrder({ ...newOrder, assignedTo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baker Team A">Baker Team A</SelectItem>
                        <SelectItem value="Baker Team B">Baker Team B</SelectItem>
                        <SelectItem value="Baker Team C">Baker Team C</SelectItem>
                        <SelectItem value="Production Team A">Production Team A</SelectItem>
                        <SelectItem value="Production Team B">Production Team B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipe">Recipe</Label>
                    <Select value={newOrder.recipe} onValueChange={(value) => setNewOrder({ ...newOrder, recipe: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipes.map((recipe) => (
                          <SelectItem key={recipe.id} value={recipe.code}>
                            {recipe.code} - {recipe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      step="0.1"
                      value={newOrder.estimatedTime}
                      onChange={(e) => setNewOrder({ ...newOrder, estimatedTime: e.target.value })}
                      placeholder="Enter estimated hours"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateOrder}>Create Order</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search production orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Production Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Production Orders</CardTitle>
                  <CardDescription>
                    Manage and track all production orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Batch Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{order.batchSize}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${order.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{order.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{order.dueDate}</TableCell>
                            <TableCell>{order.assignedTo}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <PlayCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recipes & Formulas</CardTitle>
                <CardDescription>
                  Manage production recipes and formulas
                </CardDescription>
              </div>
              <Button onClick={() => setActiveTab("create-recipe")} className="gap-2">
                <Plus className="h-4 w-4" />
                New Recipe
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{recipe.code}</Badge>
                        <Badge>{recipe.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          <span>Batch: {recipe.batchSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>{recipe.totalTime}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{recipe.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${recipe.cost}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          {recipe.ingredients.length} ingredients
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Checks</CardTitle>
              <CardDescription>
                Monitor quality control checkpoints and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Production Order</TableHead>
                      <TableHead>Check Point</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Checked By</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qualityChecks.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>PRD-{String(check.productionId).padStart(3, '0')}</TableCell>
                        <TableCell>{check.checkPoint}</TableCell>
                        <TableCell>
                          <Badge variant={check.status === "Passed" ? "default" : "destructive"}>
                            {check.status === "Passed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {check.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{check.checkedBy}</TableCell>
                        <TableCell>{check.timestamp}</TableCell>
                        <TableCell>{check.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Factory className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === "In Progress").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently in production</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === "Completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Orders completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Production Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(orders.reduce((sum, o) => sum + o.actualTime, 0) / orders.length).toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground">Per order</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipes.length}</div>
                <p className="text-xs text-muted-foreground">Available formulas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Production Overview</CardTitle>
              <CardDescription>
                Key metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Production Efficiency</h4>
                    <div className="space-y-2">
                      {orders.filter(o => o.actualTime > 0).map((order) => (
                        <div key={order.id} className="flex justify-between items-center">
                          <span className="text-sm">{order.productName}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  order.actualTime <= order.estimatedTime ? 'bg-green-600' : 'bg-red-600'
                                }`}
                                style={{ 
                                  width: `${Math.min((order.actualTime / order.estimatedTime) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs">
                              {order.actualTime}h/{order.estimatedTime}h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Quality Pass Rate</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {((qualityChecks.filter(q => q.status === "Passed").length / qualityChecks.length) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {qualityChecks.filter(q => q.status === "Passed").length} of {qualityChecks.length} checks passed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
