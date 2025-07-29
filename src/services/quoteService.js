// Quote Service - Handles Sales Quote (Estimate) transactions
// Consistent patterns with other transaction services

const delay = () => new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

export const quoteService = {
  // List quotes
  async getQuotes(params = {}) {
    await delay()
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      dateFrom = "",
      dateTo = "",
    } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      status: status || "all",
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    })

    try {
      const res = await fetch(`/api/transactions/quotes?${queryParams}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch quotes")
      return data
    } catch (err) {
      console.error("Error fetching quotes:", err)
      throw err
    }
  },

  // Single quote
  async getQuoteById(id) {
    await delay()
    try {
      const res = await fetch(`/api/transactions/quotes/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch quote")
      return data
    } catch (err) {
      console.error("Error fetching quote:", err)
      throw err
    }
  },

  // Create quote
  async createQuote(payload) {
    await delay()
    try {
      const res = await fetch("/api/transactions/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create quote")
      return data
    } catch (err) {
      console.error("Error creating quote:", err)
      throw err
    }
  },

  // Update quote
  async updateQuote(id, payload) {
    await delay()
    try {
      const res = await fetch(`/api/transactions/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update quote")
      return data
    } catch (err) {
      console.error("Error updating quote:", err)
      throw err
    }
  },

  // Delete quote
  async deleteQuote(id) {
    await delay()
    try {
      const res = await fetch(`/api/transactions/quotes/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete quote")
      return data
    } catch (err) {
      console.error("Error deleting quote:", err)
      throw err
    }
  },
}
