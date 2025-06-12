// CRM Service - API-like calls for Customer Relationship Management
// This service provides methods for managing customers, leads, and deals

// Simulate API delay for realistic behavior
const delay = () => new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))

export const crmService = {
  // Customer management methods
  async getCustomers(params = {}) {
    await delay()
    
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      type = ''
    } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      status: status || 'all',
      type: type || 'all'
    })
    
    try {
      const response = await fetch(`/api/crm/customers?${queryParams}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customers')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching customers:', error)
      throw error
    }
  },

  async getCustomerById(id) {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/customers/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customer')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    }
  },

  async createCustomer(customerData) {
    await delay()
    
    try {
      const response = await fetch('/api/crm/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer')
      }
      
      return data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  },

  async updateCustomer(id, customerData) {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer')
      }
      
      return data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  async deleteCustomer(id) {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/customers/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete customer')
      }
      
      return data
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  },

  // Lead management methods
  async getLeads(params = {}) {
    await delay()
    
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      source = ''
    } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      status: status || 'all',
      source: source || 'all'
    })
    
    try {
      const response = await fetch(`/api/crm/leads?${queryParams}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leads')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching leads:', error)
      throw error
    }
  },

  async createLead(leadData) {
    await delay()
    
    try {
      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create lead')
      }
      
      return data
    } catch (error) {
      console.error('Error creating lead:', error)
      throw error
    }
  },

  async updateLead(id, leadData) {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update lead')
      }
      
      return data
    } catch (error) {
      console.error('Error updating lead:', error)
      throw error
    }
  },

  // Deal management methods
  async getDeals(params = {}) {
    await delay()
    
    const {
      page = 1,
      limit = 10,
      search = '',
      stage = ''
    } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      stage: stage || 'all'
    })
    
    try {
      const response = await fetch(`/api/crm/deals?${queryParams}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch deals')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching deals:', error)
      throw error
    }
  },

  async createDeal(dealData) {
    await delay()
    
    try {
      const response = await fetch('/api/crm/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create deal')
      }
      
      return data
    } catch (error) {
      console.error('Error creating deal:', error)
      throw error
    }  },

  // Opportunity management methods
  async getOpportunities(params = {}) {
    await delay()
    
    const {
      page = 1,
      limit = 10,
      search = '',
      stage = ''
    } = params
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      stage: stage || 'all'
    })
    
    try {
      const response = await fetch(`/api/crm/opportunities?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch opportunities')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      // Return mock data for now
      return {
        opportunities: [
          {
            id: 'opp-001',
            name: 'Enterprise License Expansion',
            company: 'Acme Corp',
            amount: 125000,
            stage: 'Proposal',
            probability: 65,
            expectedCloseDate: '2025-08-15',
            assignedTo: 'sales-rep-1',
            createdAt: '2025-05-20'
          },
          {
            id: 'opp-002',
            name: 'Cloud Migration Project',
            company: 'Global Industries',
            amount: 250000,
            stage: 'Negotiation',
            probability: 80,
            expectedCloseDate: '2025-07-01',
            assignedTo: 'sales-rep-2',
            createdAt: '2025-04-15'
          },
          {
            id: 'opp-003',
            name: 'Maintenance Contract Renewal',
            company: 'TechNova',
            amount: 75000,
            stage: 'Qualification',
            probability: 50,
            expectedCloseDate: '2025-09-30',
            assignedTo: 'sales-rep-3',
            createdAt: '2025-06-01'
          }
        ],
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }
    }
  },
  async getActivities(params = {}) {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/activities`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch activities')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching activities:', error)
      // Return mock data for now
      return {
        activities: [
          {
            id: 'act-001',
            type: 'Call',
            subject: 'Follow-up on proposal',
            relatedTo: 'Acme Corp',
            assignedTo: 'sales-rep-1',
            dueDate: '2025-06-15',
            status: 'Completed',
            notes: 'Discussed pricing considerations, they will review internally'
          },
          {
            id: 'act-002',
            type: 'Meeting',
            subject: 'Demo presentation',
            relatedTo: 'Global Industries',
            assignedTo: 'sales-rep-2',
            dueDate: '2025-06-18',
            status: 'Scheduled',
            notes: 'Will present the latest features to their tech team'
          },
          {
            id: 'act-003',
            type: 'Email',
            subject: 'Send contract draft',
            relatedTo: 'TechNova',
            assignedTo: 'sales-rep-3',
            dueDate: '2025-06-14',
            status: 'Pending',
            notes: 'Need to have legal review the terms first'
          }
        ],
        meta: {
          total: 3
        }
      }
    }
  },
  async getAccounts(params = {}) {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/accounts`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch accounts')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching accounts:', error)
      // Return mock data for now
      return {
        accounts: [
          {
            id: 'acc-001',
            name: 'Acme Corp',
            industry: 'Manufacturing',
            revenue: 5000000,
            employees: 500,
            status: 'Active',
            contactName: 'John Smith',
            contactEmail: 'john@acmecorp.com',
            contactPhone: '123-456-7890'
          },
          {
            id: 'acc-002',
            name: 'Global Industries',
            industry: 'Technology',
            revenue: 12000000,
            employees: 1200,
            status: 'Active',
            contactName: 'Sarah Johnson',
            contactEmail: 'sarah@globalind.com',
            contactPhone: '987-654-3210'
          },
          {
            id: 'acc-003',
            name: 'TechNova',
            industry: 'Software',
            revenue: 3000000,
            employees: 150,
            status: 'Prospect',
            contactName: 'Michael Lee',
            contactEmail: 'michael@technova.com',
            contactPhone: '555-123-4567'
          }
        ],
        meta: {
          total: 3
        }
      }
    }
  },  async getPipeline() {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/pipeline`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch pipeline data')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching pipeline:', error)
      // Return mock data for now
      return {
        pipeline: {
          stages: [
            { id: 'stage-1', name: 'Qualification', count: 2, value: 275000, color: '#6b7280' },
            { id: 'stage-2', name: 'Needs Analysis', count: 2, value: 285000, color: '#3b82f6' },
            { id: 'stage-3', name: 'Value Proposition', count: 1, value: 45000, color: '#8b5cf6' },
            { id: 'stage-4', name: 'Proposal', count: 1, value: 180000, color: '#f59e0b' },
            { id: 'stage-5', name: 'Negotiation', count: 1, value: 320000, color: '#10b981' },
            { id: 'stage-6', name: 'Closed Won', count: 1, value: 95000, color: '#059669' },
            { id: 'stage-7', name: 'Closed Lost', count: 1, value: 75000, color: '#dc2626' }
          ],
          totalValue: 1275000,
          totalOpportunities: 9
        }
      }
    }
  },
  async getSalesTeam() {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/sales-team`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch sales team data')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching sales team:', error)
      // Return mock data for now
      return {
        team: [
          { 
            id: 'sales-rep-1', 
            name: 'Jennifer Adams', 
            role: 'Account Executive',
            avatar: '/avatars/jennifer.png',
            deals: 12,
            quota: 500000,
            achieved: 375000
          },
          { 
            id: 'sales-rep-2', 
            name: 'Robert Chen', 
            role: 'Sales Manager',
            avatar: '/avatars/robert.png',
            deals: 9,
            quota: 750000,
            achieved: 820000
          },
          { 
            id: 'sales-rep-3', 
            name: 'Maria Rodriguez', 
            role: 'Business Development',
            avatar: '/avatars/maria.png',
            deals: 15,
            quota: 400000,
            achieved: 310000
          }
        ]
      }
    }
  },
  async getStats() {
    await delay()
    
    try {
      const response = await fetch(`/api/crm/dashboard-stats`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch CRM stats')
      }
      
      return data.stats || data
    } catch (error) {
      console.error('Error fetching CRM stats:', error)
      // Return mock data for now
      return {
        newLeads: 38,
        leadsChange: '+12%',
        openDeals: 27,
        dealsChange: '+5%',
        closedDeals: 18,
        closedDealsChange: '+24%',
        conversionRate: '28%',
        conversionChange: '+3%'
      }
    }
  },

  // Get CRM statistics
  async getCrmStats() {
    await delay()
    
    try {
      const response = await fetch('/api/crm/stats')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch CRM stats')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching CRM stats:', error)
      throw error
    }
  },

  // Get dropdown options
  async getCustomerStatuses() {
    await delay()
    
    return {
      success: true,
      data: ['Active', 'Inactive', 'Prospect']
    }
  },

  async getCustomerTypes() {
    await delay()
    
    return {
      success: true,
      data: ['Regular', 'Premium', 'VIP', 'Wholesale']
    }
  },

  async getLeadStatuses() {
    await delay()
    
    return {
      success: true,
      data: ['New', 'Contacted', 'Qualified', 'Lost']
    }
  },

  async getLeadSources() {
    await delay()
    
    return {
      success: true,
      data: ['Website', 'Referral', 'Cold Call', 'Social Media', 'Trade Show', 'Advertisement']
    }
  },

  async getDealStages() {
    await delay()
    
    return {
      success: true,
      data: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
    }
  }
}

// Default export
export default crmService
