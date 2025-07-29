// Customer service for API-like calls
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const customerService = {
  // Fetch all customers with pagination and filters
  async getCustomers(params = {}) {
    await delay();
    
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      status = '',
      industry = ''
    } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(type && { type }),
      ...(status && { status }),
      ...(industry && { industry })
    });
    
    try {
      const response = await fetch(`/api/customers?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Fetch single customer by ID
  async getCustomerById(id) {
    await delay();
    
    try {
      const response = await fetch(`/api/customers/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customer');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Create new customer
  async createCustomer(customerData) {
    await delay();
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update existing customer
  async updateCustomer(id, customerData) {
    await delay();
    
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(id) {
    await delay();
    
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete customer');
      }
      
      return { success: true, message: 'Customer deleted successfully' };
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Fetch customer metadata (types, statuses, industries)
  async getCustomerMetadata() {
    await delay();
    
    try {
      const response = await fetch('/api/customers/metadata');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customer metadata');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching customer metadata:', error);
      throw error;
    }
  },

  // Fetch customer statistics
  async getCustomerStats() {
    await delay();
    
    try {
      const response = await fetch('/api/customers/stats');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customer statistics');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      throw error;
    }
  },

  // Search customers
  async searchCustomers(query) {
    await delay();
    
    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search customers');
      }
      
      return data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  },

  // Bulk operations
  async bulkUpdateCustomers(customerIds, updateData) {
    await delay();
    
    try {
      const response = await fetch('/api/customers/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerIds, updateData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to bulk update customers');
      }
      
      return data;
    } catch (error) {
      console.error('Error bulk updating customers:', error);
      throw error;
    }
  },

  async bulkDeleteCustomers(customerIds) {
    await delay();
    
    try {
      const response = await fetch('/api/customers/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerIds }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to bulk delete customers');
      }
      
      return data;
    } catch (error) {
      console.error('Error bulk deleting customers:', error);
      throw error;
    }
  },

  // Export customers
  async exportCustomers(format = 'csv', filters = {}) {
    await delay();
    
    const queryParams = new URLSearchParams({
      format,
      ...filters
    });
    
    try {
      const response = await fetch(`/api/customers/export?${queryParams}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export customers');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Customers exported successfully' };
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  }
}

export default customerService;
