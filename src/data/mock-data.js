import mockData from './mock-data.json'

/**
 * Get mock data item by ID from a specific category
 * @param {string} category - The category of data (e.g., 'creditNotes', 'customers', 'products')
 * @param {string|number} id - The ID to search for
 * @returns {Object|null} - The found item or null if not found
 */
export function getMockDataById(category, id) {
  try {
    // Convert id to string for consistent comparison
    const searchId = String(id)
    
    // Check if the category exists in mock data
    if (!mockData[category]) {
      console.warn(`Category '${category}' not found in mock data`)
      return null
    }
    
    // Find the item by ID
    const found = mockData[category].find(item => String(item.id) === searchId)
    
    if (!found) {
      console.warn(`Item with ID '${id}' not found in category '${category}'`)
      return null
    }
    
    return found
  } catch (error) {
    console.error('Error fetching mock data by ID:', error)
    return null
  }
}

/**
 * Get all mock data for a specific category
 * @param {string} category - The category of data
 * @returns {Array} - Array of items in the category
 */
export function getMockDataByCategory(category) {
  try {
    if (!mockData[category]) {
      console.warn(`Category '${category}' not found in mock data`)
      return []
    }
    
    return mockData[category]
  } catch (error) {
    console.error('Error fetching mock data by category:', error)
    return []
  }
}

/**
 * Get all available categories in mock data
 * @returns {Array} - Array of category names
 */
export function getMockDataCategories() {
  try {
    return Object.keys(mockData)
  } catch (error) {
    console.error('Error fetching mock data categories:', error)
    return []
  }
}

// Export the raw mock data as well
export default mockData
