// Delivery Note Service - Handles Delivery Note transactions
// Consistent structure with saleService & purchaseService

const delay = () => new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))

export const deliveryNoteService = {
  // Fetch list of delivery notes
  async getDeliveryNotes(params = {}) {
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
      const res = await fetch(`/api/transactions/delivery-notes?${queryParams}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch delivery notes")
      return data
    } catch (err) {
      console.error("Error fetching delivery notes:", err)
      throw err
    }
  },

  // Single delivery note
  async getDeliveryNoteById(id) {
    await delay()
    try {
      const res = await fetch(`/api/transactions/delivery-notes/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch delivery note")
      return data
    } catch (err) {
      console.error("Error fetching delivery note:", err)
      throw err
    }
  },

  // Create
  async createDeliveryNote(payload) {
    await delay()
    try {
      const res = await fetch("/api/transactions/delivery-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create delivery note")
      return data
    } catch (err) {
      console.error("Error creating delivery note:", err)
      throw err
    }
  },

  // Update
  async updateDeliveryNote(id, payload) {
    await delay()
    try {
      const res = await fetch(`/api/transactions/delivery-notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update delivery note")
      return data
    } catch (err) {
      console.error("Error updating delivery note:", err)
      throw err
    }
  },

  // Delete
  async deleteDeliveryNote(id) {
    await delay()
    try {
      const res = await fetch(`/api/transactions/delivery-notes/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete delivery note")
      return data
    } catch (err) {
      console.error("Error deleting delivery note:", err)
      throw err
    }
  },
}
