// Purchase Service - API-like calls for Purchase Transactions
// Mirrored structure to crmService and saleService for consistency

const delay = () => new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

export const purchaseService = {
  // List purchases
  async getPurchases(params = {}) {
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
      const response = await fetch(`/api/transactions/purchases?${queryParams}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch purchases")
      }
      return data
    } catch (error) {
      console.error("Error fetching purchases:", error)
      throw error
    }
  },

  // Single purchase
  async getPurchaseById(id) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/purchases/${id}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch purchase")
      }
      return data
    } catch (error) {
      console.error("Error fetching purchase:", error)
      throw error
    }
  },

  // Create purchase
  async createPurchase(purchaseData) {
    await delay()
    try {
      const response = await fetch("/api/transactions/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create purchase")
      }
      return data
    } catch (error) {
      console.error("Error creating purchase:", error)
      throw error
    }
  },

  // Update purchase
  async updatePurchase(id, purchaseData) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/purchases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update purchase")
      }
      return data
    } catch (error) {
      console.error("Error updating purchase:", error)
      throw error
    }
  },

  // Delete purchase
  async deletePurchase(id) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/purchases/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete purchase")
      }
      return data
    } catch (error) {
      console.error("Error deleting purchase:", error)
      throw error
    }
  },
}
