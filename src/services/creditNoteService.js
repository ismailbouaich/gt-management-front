// Credit Note Service - API-like calls for Credit Note Transactions
// Mirrors the structure of purchaseService & saleService for consistency

// Simulated network latency helper – remove once real API is fully stable
const delay = () => new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

export const creditNoteService = {
  // List credit notes
  async getCreditNotes(params = {}) {
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
      const response = await fetch(`/api/transactions/credit-notes?${queryParams}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch credit notes")
      return data
    } catch (error) {
      console.error("Error fetching credit notes:", error)
      throw error
    }
  },

  // Single credit note
  async getCreditNoteById(id) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/credit-notes/${id}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch credit note")
      return data
    } catch (error) {
      console.error("Error fetching credit note:", error)
      throw error
    }
  },

  // Create credit note
  async createCreditNote(payload) {
    await delay()
    try {
      const response = await fetch("/api/transactions/credit-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create credit note")
      return data
    } catch (error) {
      console.error("Error creating credit note:", error)
      throw error
    }
  },

  // Update credit note
  async updateCreditNote(id, payload) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/credit-notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to update credit note")
      return data
    } catch (error) {
      console.error("Error updating credit note:", error)
      throw error
    }
  },

  // Delete credit note
  async deleteCreditNote(id) {
    await delay()
    try {
      const response = await fetch(`/api/transactions/credit-notes/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to delete credit note")
      return data
    } catch (error) {
      console.error("Error deleting credit note:", error)
      throw error
    }
  },
}
