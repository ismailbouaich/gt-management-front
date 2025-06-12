import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Phone, 
  Mail, 
  MapPin,
  Building2,
  Star,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  MoreHorizontal,
  ArrowRight,
  UserPlus,
  Handshake,
  BrainCircuit
} from 'lucide-react'
import { crmService } from '@/services/crmService'
import { DraggablePipeline } from './draggable-pipeline'

export function CrmDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStage, setSelectedStage] = useState('all')
  const [selectedAssignee, setSelectedAssignee] = useState('all')
  
  // Data states
  const [opportunities, setOpportunities] = useState([])
  const [leads, setLeads] = useState([])
  const [activities, setActivities] = useState([])
  const [accounts, setAccounts] = useState([])
  const [pipeline, setPipeline] = useState({ stages: [] })
  const [salesTeam, setSalesTeam] = useState([])
  const [crmStats, setCrmStats] = useState({})

  // Dialog states
  const [showCreateLead, setShowCreateLead] = useState(false)
  const [showCreateOpportunity, setShowCreateOpportunity] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Load CRM data
  useEffect(() => {
    loadCrmData()
  }, [])

  const loadCrmData = async () => {
    setLoading(true)
    try {
      const [
        opportunitiesData,
        leadsData,
        activitiesData,
        accountsData,
        pipelineData,
        teamData,
        statsData
      ] = await Promise.all([
        crmService.getOpportunities(),
        crmService.getLeads(),
        crmService.getActivities(),
        crmService.getAccounts(),
        crmService.getPipeline(),
        crmService.getSalesTeam(),
        crmService.getStats()
      ])

      console.log('Loaded opportunities:', opportunitiesData.opportunities?.length || 0)
      console.log('Loaded pipeline:', pipelineData.pipeline?.stages?.length || 0)
      console.log('Sample opportunity:', opportunitiesData.opportunities?.[0])

      setOpportunities(opportunitiesData.opportunities || [])
      setLeads(leadsData.leads || [])
      setActivities(activitiesData.activities || [])
      setAccounts(accountsData.accounts || [])
      setPipeline(pipelineData.pipeline || { stages: [] })
      setSalesTeam(teamData.team || [])
      setCrmStats(statsData.stats || {})
    } catch (error) {
      console.error('Error loading CRM data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle opportunity updates (for drag & drop)
  const handleUpdateOpportunity = async (updatedOpportunity) => {
    try {
      // Optimistically update the local state
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === updatedOpportunity.id ? updatedOpportunity : opp
        )
      )

      // TODO: Call API to update opportunity in backend
      // await crmService.updateOpportunity(updatedOpportunity.id, updatedOpportunity)
      
      console.log('Opportunity updated:', updatedOpportunity)
    } catch (error) {
      console.error('Error updating opportunity:', error)
      // Revert optimistic update on error
      loadCrmData()
    }
  }

  // Handle adding new opportunities
  const handleAddOpportunity = (stageId) => {
    setShowCreateOpportunity(true)
    // You could pre-fill the stage here if needed
  }

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalOpportunities = opportunities.length
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
    const weightedValue = opportunities.reduce((sum, opp) => sum + ((opp.amount || 0) * (opp.probability || 0) / 100), 0)
    const avgDealSize = totalOpportunities > 0 ? totalValue / totalOpportunities : 0
    
    const wonOpportunities = opportunities.filter(opp => opp.stage === 'Closed Won').length
    const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0
    
    const activeLeads = leads.filter(lead => !lead.isConverted).length
    const convertedLeads = leads.filter(lead => lead.isConverted).length
    const leadConversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0

    return {
      totalOpportunities,
      totalValue,
      weightedValue,
      avgDealSize,
      conversionRate,
      activeLeads,
      leadConversionRate
    }
  }, [opportunities, leads])

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = searchTerm === '' || 
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStage = selectedStage === 'all' || opp.stageId === selectedStage
      const matchesAssignee = selectedAssignee === 'all' || opp.assignedTo === selectedAssignee
      
      return matchesSearch && matchesStage && matchesAssignee
    })
  }, [opportunities, searchTerm, selectedStage, selectedAssignee])

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesSearch
    })
  }, [leads, searchTerm])

  // Pipeline data for visualization
  const pipelineData = useMemo(() => {
    const stages = pipeline.stages || []
    return stages.map(stage => {
      const stageOpportunities = opportunities.filter(opp => opp.stageId === stage.id)
      const stageValue = stageOpportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
      
      return {
        ...stage,
        count: stageOpportunities.length,
        value: stageValue,
        opportunities: stageOpportunities
      }
    })
  }, [opportunities, pipeline.stages])

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-purple-100 text-purple-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-emerald-100 text-emerald-800'
      case 'unqualified': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin mr-2" />
        <span>Loading CRM data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage your sales pipeline like Odoo CRM</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadCrmData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${kpis.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Weighted: ${kpis.weightedValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.totalOpportunities}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${kpis.avgDealSize.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.activeLeads}</div>
                <p className="text-xs text-muted-foreground">
                  Conversion: {kpis.leadConversionRate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  This period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline Overview</CardTitle>
              <CardDescription>Opportunities by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {pipelineData.map((stage, index) => (
                  <div key={stage.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <Badge variant="outline">{stage.count}</Badge>
                    </div>
                    <div 
                      className="h-2 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div className="text-xs text-muted-foreground">
                      ${stage.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities & Team Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest sales activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'call' && <Phone className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'email' && <Mail className="h-4 w-4 text-green-600" />}
                        {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'demo' && <Eye className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.subject}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Team Performance</CardTitle>
                <CardDescription>Quota achievement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesTeam.map((member) => {
                    const achievement = (member.achievements / member.quota) * 100
                    return (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {achievement.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={achievement} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${member.achievements.toLocaleString()}</span>
                          <span>${member.quota.toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Sales Pipeline
              </CardTitle>
              <CardDescription>
                Drag and drop opportunities between pipeline stages to update their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DraggablePipeline
                pipeline={pipeline}
                opportunities={opportunities}
                onUpdateOpportunity={handleUpdateOpportunity}
                onAddOpportunity={handleAddOpportunity}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {pipeline.stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {salesTeam.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleAddOpportunity(selectedStage)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Opportunity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities Table */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunities ({filteredOpportunities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{opp.name}</div>
                          <div className="text-sm text-muted-foreground">{opp.contactName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{opp.company}</div>
                          <div className="text-sm text-muted-foreground">{opp.source}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: pipeline.stages.find(s => s.id === opp.stageId)?.color + '20',
                            color: pipeline.stages.find(s => s.id === opp.stageId)?.color
                          }}
                        >
                          {opp.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${opp.amount?.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={opp.probability} className="w-16 h-2" />
                          <span className="text-sm">{opp.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(opp.expectedCloseDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {salesTeam.find(m => m.id === opp.assignedTo)?.name.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {salesTeam.find(m => m.id === opp.assignedTo)?.name || 'Unassigned'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          {/* Leads Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Leads</h2>
              <p className="text-muted-foreground">Manage and qualify your leads</p>
            </div>
            <Button onClick={() => setShowCreateLead(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.company}</div>
                          <div className="text-sm text-muted-foreground">{lead.jobTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={lead.score} className="w-16 h-2" />
                          <span className="text-sm">{lead.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${lead.estimatedValue?.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {salesTeam.find(m => m.id === lead.assignedTo)?.name.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {salesTeam.find(m => m.id === lead.assignedTo)?.name || 'Unassigned'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Handshake className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
              <CardDescription>Track all sales activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'call' && <Phone className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'email' && <Mail className="h-5 w-5 text-green-600" />}
                      {activity.type === 'meeting' && <Calendar className="h-5 w-5 text-purple-600" />}
                      {activity.type === 'demo' && <Eye className="h-5 w-5 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.subject}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>
                            {activity.priority}
                          </Badge>
                          {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {activity.status === 'planned' && <Clock className="h-4 w-4 text-blue-600" />}
                          {activity.status === 'overdue' && <AlertCircle className="h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(activity.date).toLocaleString()}</span>
                        <span>•</span>
                        <span>{activity.relatedTo}: {activity.relatedId}</span>
                        <span>•</span>
                        <span>Assigned to: {salesTeam.find(m => m.id === activity.assignedTo)?.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Pipeline Value</span>
                    <span className="font-medium">${kpis.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weighted Pipeline</span>
                    <span className="font-medium">${kpis.weightedValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Deal Size</span>
                    <span className="font-medium">${kpis.avgDealSize.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate</span>
                    <span className="font-medium">{kpis.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Leads</span>
                    <span className="font-medium">{kpis.activeLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium">{kpis.leadConversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qualified Leads</span>
                    <span className="font-medium">{leads.filter(l => l.isQualified).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New This Week</span>
                    <span className="font-medium">
                      {leads.filter(l => {
                        const created = new Date(l.createdAt)
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return created > weekAgo
                      }).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesTeam.map((member) => {
                    const achievement = (member.achievements / member.quota) * 100
                    return (
                      <div key={member.id} className="flex justify-between items-center">
                        <span className="text-sm">{member.name}</span>
                        <span className="font-medium">{achievement.toFixed(0)}%</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
