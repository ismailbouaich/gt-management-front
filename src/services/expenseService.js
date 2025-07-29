// Expense Service - Mock CRUD helpers leveraging mock-data.json
// Replace with real API calls once the backend is available.

const delay = () => new Promise((res) => setTimeout(res, 200 + Math.random() * 300))

// Lazy–loaded in-memory data (clone so we can mutate safely)
let expensesCache = null

async function ensureLoaded() {
  if (!expensesCache) {
    const { expenseData } = await import("@/data/mock-data.json")
    expensesCache = expenseData.map((e) => ({ ...e }))
  }
}

export const expenseService = {
  // List with simple pagination & filters (client-side for now)
  async list({ page = 1, limit = 10, search = "", status = "" } = {}) {
    await delay()
    await ensureLoaded()

    let data = [...expensesCache]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((e) => e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
    }
    if (status) data = data.filter((e) => e.status === status)

    const total = data.length
    const offset = (page - 1) * limit
    const paginated = data.slice(offset, offset + limit)
    return { data: paginated, total }
  },

  async getById(id) {
    await delay()
    await ensureLoaded()
    return expensesCache.find((e) => e.id === Number(id)) || null
  },

  async create(payload) {
    await delay()
    await ensureLoaded()
    const newId = expensesCache.reduce((max, e) => Math.max(max, e.id), 0) + 1
    const record = { id: newId, ...payload }
    expensesCache.push(record)
    return record
  },

  async update(id, payload) {
    await delay()
    await ensureLoaded()
    const idx = expensesCache.findIndex((e) => e.id === Number(id))
    if (idx === -1) throw new Error("Expense not found")
    expensesCache[idx] = { ...expensesCache[idx], ...payload }
    return expensesCache[idx]
  },

  async remove(id) {
    await delay()
    await ensureLoaded()
    const idx = expensesCache.findIndex((e) => e.id === Number(id))
    if (idx === -1) throw new Error("Expense not found")
    const [removed] = expensesCache.splice(idx, 1)
    return removed
  },
}
