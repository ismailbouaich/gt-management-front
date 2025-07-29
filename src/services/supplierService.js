// Supplier service for API-like calls
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const supplierService = {
  // Fetch all suppliers with pagination and filters
  async getSuppliers(params = {}) {
    await delay();
    
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      status = '',
      category = ''
    } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(type && { type }),
      ...(status && { status }),
      ...(category && { category })
    });
    
    try {
      const response = await fetch(`/api/suppliers?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch suppliers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  // Fetch single supplier by ID
  async getSupplierById(id) {
    await delay();
    
    try {
      const response = await fetch(`/api/suppliers/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch supplier');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    }
  },

  // Create new supplier
  async createSupplier(supplierData) {
    await delay();
    
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create supplier');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  // Update existing supplier
  async updateSupplier(id, supplierData) {
    await delay();
    
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update supplier');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },

  // Delete supplier
  async deleteSupplier(id) {
    await delay();
    
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete supplier');
      }
      
      return { success: true, message: 'Supplier deleted successfully' };
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  },

  // Fetch supplier metadata (types, statuses, categories)
  async getSupplierMetadata() {
    await delay();
    
    try {
      const response = await fetch('/api/suppliers/metadata');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch supplier metadata');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching supplier metadata:', error);
      throw error;
    }
  },

  // Fetch supplier statistics
  async getSupplierStats() {
    await delay();
    
    try {
      const response = await fetch('/api/suppliers/stats');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch supplier statistics');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching supplier statistics:', error);
      throw error;
    }
  },

  // Search suppliers
  async searchSuppliers(query) {
    await delay();
    
    try {
      const response = await fetch(`/api/suppliers/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search suppliers');
      }
      
      return data;
    } catch (error) {
      console.error('Error searching suppliers:', error);
      throw error;
    }
  },

  // Bulk operations
  async bulkUpdateSuppliers(supplierIds, updateData) {
    await delay();
    
    try {
      const response = await fetch('/api/suppliers/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierIds, updateData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to bulk update suppliers');
      }
      
      return data;
    } catch (error) {
      console.error('Error bulk updating suppliers:', error);
      throw error;
    }
  },

  async bulkDeleteSuppliers(supplierIds) {
    await delay();
    
    try {
      const response = await fetch('/api/suppliers/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierIds }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to bulk delete suppliers');
      }
      
      return data;
    } catch (error) {
      console.error('Error bulk deleting suppliers:', error);
      throw error;
    }
  },

  // Export suppliers
  async exportSuppliers(format = 'csv', filters = {}) {
    await delay();
    
    const queryParams = new URLSearchParams({
      format,
      ...filters
    });
    
    try {
      const response = await fetch(`/api/suppliers/export?${queryParams}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export suppliers');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suppliers.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Suppliers exported successfully' };
    } catch (error) {
      console.error('Error exporting suppliers:', error);
      throw error;
    }
  }
}

export default supplierService;
