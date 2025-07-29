// Sale Service - API-like calls for Sales Transactions
// Structured similarly to crmService for consistency

// Simulate API delay for realistic network latency
const delay = () => new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

export const saleService = {
  // List sales with optional filters & pagination
  async getSales(params = {}) {
    await delay()

    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      paymentStatus = "",
      dateFrom = "",
      dateTo = "",
    } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      status: status || "all",
      paymentStatus: paymentStatus || "all",
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    })

    try {
      const response = await fetch(`/api/transactions/sales?${queryParams}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch sales")
      }
      return data
    } catch (error) {
      console.error("Error fetching sales:", error)
      throw error
    }
  },

  // Fetch a single sale by ID
  async getSaleById(id) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/sales/${id}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch sale")
      }
      return data
    } catch (error) {
      console.error("Error fetching sale:", error)
      throw error
    }
  },

  // Create a new sale
  async createSale(saleData) {
    await delay()
    try {
      const response = await fetch("/api/transactions/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create sale")
      }
      return data
    } catch (error) {
      console.error("Error creating sale:", error)
      throw error
    }
  },

  // Update an existing sale
  async updateSale(id, saleData) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update sale")
      }
      return data
    } catch (error) {
      console.error("Error updating sale:", error)
      throw error
    }
  },

  // Delete a sale
  async deleteSale(id) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/sales/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete sale")
      }
      return data
    } catch (error) {
      console.error("Error deleting sale:", error)
      throw error
    }
  },
}
