// Product service for API-like calls
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  // Fetch all products with pagination and filters
  async getProducts(params = {}) {
    await delay();
    
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
      brand = ''
    } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category }),
      ...(status && { status }),
      ...(brand && { brand })
    });
    
    try {
      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch single product by ID
  async getProductById(id) {
    await delay();
    
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product
  async createProduct(productData) {
    await delay();
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id, productData) {
    await delay();
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    await delay();
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get product categories
  async getCategories() {
    await delay(50);
    
    return {
      success: true,
      data: [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Beauty',
        'Food',
        'Automotive'
      ]
    };
  },

  // Get product brands
  async getBrands() {
    await delay(50);
    
    return {
      success: true,
      data: [
        'Apple',
        'Samsung',
        'Sony',
        'Microsoft',
        'HP',
        'Dell',
        'Canon',
        'Nike',
        'Adidas',
        'Generic'
      ]
    };
  },

  // Get product statistics
  async getProductStats() {
    await delay();
    
    return {
      success: true,
      data: {
        totalProducts: 50,
        inStock: 35,
        lowStock: 10,
        outOfStock: 5,
        totalValue: 125000,
        categories: 8,
        brands: 10
      }
    };
  },

  // Category management methods
  async getCategoriesWithDetails() {
    await delay();
    
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch categories');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching categories with details:', error);
      throw error;
    }
  },

  async createCategory(categoryData) {
    await delay();
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Brand management methods
  async getBrandsWithDetails() {
    await delay();
    
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch brands');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching brands with details:', error);
      throw error;
    }
  },

  async createBrand(brandData) {
    await delay();
    
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create brand');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }
};

// Default export
export default productService;
