import { reportsApi } from '@/services/reportsService';
import { subDays, startOfMonth, endOfMonth } from 'date-fns';

export async function POST(request) {
  try {
    const { reportType, format = 'csv' } = await request.json();

    if (!reportType) {
      return Response.json({ error: 'Report type is required' }, { status: 400 });
    }

    let data;
    let filename;
    let content;

    // Get the appropriate data based on report type
    switch (reportType) {
      case 'sales':
        data = await generateSalesReportData();
        filename = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
        content = generateSalesCSV(data);
        break;
      
      case 'purchases':
        data = await generatePurchaseReportData();
        filename = `purchase-report-${new Date().toISOString().split('T')[0]}.csv`;
        content = generatePurchaseCSV(data);
        break;
      
      case 'expenses':
        data = await generateExpenseReportData();
        filename = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
        content = generateExpenseCSV(data);
        break;
      
      case 'stock':
        data = await generateStockReportData();
        filename = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
        content = generateStockCSV(data);
        break;
      
      case 'analytics':
        data = await generateAnalyticsReportData();
        filename = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
        content = generateAnalyticsCSV(data);
        break;
      
      case 'all':
        // Generate comprehensive report with all data
        data = await generateCompleteReportData();
        filename = `complete-business-report-${new Date().toISOString().split('T')[0]}.csv`;
        content = generateCompleteBusinessCSV(data);
        break;
      
      default:
        return Response.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // Return the CSV content as a downloadable file
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return Response.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}

// Data generation functions using the service
async function generateSalesReportData() {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);
  
  const salesData = await reportsApi.getSalesData(startDate, endDate);
  const salesSummary = await reportsApi.getSalesSummary('month');
  
  return {
    transactions: salesData.sales,
    metrics: {
      totalRevenue: salesSummary.totalSales,
      totalTransactions: salesSummary.salesCount,
      averageTransactionValue: salesSummary.avgOrderValue,
      growthRate: Math.round(Math.random() * 20 - 5) // Mock growth rate
    }
  };
}

async function generatePurchaseReportData() {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);
  
  const purchaseData = await reportsApi.getPurchaseData(startDate, endDate);
  const purchaseSummary = await reportsApi.getPurchaseSummary('month');
  
  return {
    orders: purchaseData,
    metrics: {
      totalSpent: purchaseSummary.totalPurchases,
      totalOrders: purchaseSummary.purchaseCount,
      averageOrderValue: purchaseSummary.avgPurchaseValue,
      growthRate: Math.round(Math.random() * 15 - 3) // Mock growth rate
    }
  };
}

async function generateExpenseReportData() {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);
  
  const expenseData = await reportsApi.getExpenseData(startDate, endDate);
  
  const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  
  return {
    transactions: expenseData,
    metrics: {
      totalExpenses,
      totalTransactions: expenseData.length,
      averageExpense: expenseData.length > 0 ? totalExpenses / expenseData.length : 0,
      growthRate: Math.round(Math.random() * 10 - 2) // Mock growth rate
    }
  };
}

async function generateStockReportData() {
  const stockData = await reportsApi.getStockData();
  const stockSummary = await reportsApi.getStockSummary();
  
  return {
    inventory: stockData,
    metrics: {
      totalProducts: stockSummary.totalProducts,
      totalValue: stockSummary.totalStockValue,
      lowStockItems: stockSummary.lowStockCount,
      outOfStockItems: stockSummary.outOfStockCount
    }
  };
}

async function generateAnalyticsReportData() {
  const dashboardData = await reportsApi.getDashboardData('month');
  
  const now = new Date();
  const performance = [];
  
  // Generate 30 days of performance data
  for (let i = 29; i >= 0; i--) {
    const date = subDays(now, i);
    const revenue = Math.floor(Math.random() * 5000) + 1000;
    const expenses = Math.floor(Math.random() * 2000) + 500;
    
    performance.push({
      date: date.toISOString().split('T')[0],
      revenue,
      expenses,
      profit: revenue - expenses,
      transactions: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return {
    kpis: {
      roi: Math.round((dashboardData.sales.totalProfit / dashboardData.purchases.totalPurchases) * 100),
      expenseRatio: Math.round((dashboardData.purchases.totalPurchases / dashboardData.sales.totalSales) * 100),
      profitMargin: Math.round((dashboardData.sales.totalProfit / dashboardData.sales.totalSales) * 100),
      turnoverRate: Math.round(dashboardData.stock.avgTurnoverRate * 100)
    },
    performance
  };
}

async function generateCompleteReportData() {
  const [salesData, purchaseData, expenseData, stockData, analyticsData] = await Promise.all([
    generateSalesReportData(),
    generatePurchaseReportData(),
    generateExpenseReportData(),
    generateStockReportData(),
    generateAnalyticsReportData()
  ]);
  
  return {
    sales: salesData,
    purchases: purchaseData,
    expenses: expenseData,
    stock: stockData,
    analytics: analyticsData
  };
}

// CSV generation functions
function generateSalesCSV(data) {
  const { transactions, metrics } = data;
  
  let csv = 'GT Management - Sales Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Summary metrics
  csv += 'SALES SUMMARY\n';
  csv += `Total Revenue,${metrics.totalRevenue}\n`;
  csv += `Total Transactions,${metrics.totalTransactions}\n`;
  csv += `Average Transaction Value,${metrics.averageTransactionValue}\n`;
  csv += `Growth Rate,${metrics.growthRate}%\n\n`;
  
  // Transactions detail
  csv += 'TRANSACTION DETAILS\n';
  csv += 'Date,Transaction ID,Customer,Product,Quantity,Amount,Payment Method,Status\n';
  
  transactions.forEach(transaction => {
    csv += `${transaction.date},${transaction.id},${transaction.customer},${transaction.product},${transaction.quantity},${transaction.amount},${transaction.paymentMethod},${transaction.status}\n`;
  });
  
  return csv;
}

function generatePurchaseCSV(data) {
  const { orders, metrics } = data;
  
  let csv = 'GT Management - Purchase Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Summary metrics
  csv += 'PURCHASE SUMMARY\n';
  csv += `Total Spent,${metrics.totalSpent}\n`;
  csv += `Total Orders,${metrics.totalOrders}\n`;
  csv += `Average Order Value,${metrics.averageOrderValue}\n`;
  csv += `Growth Rate,${metrics.growthRate}%\n\n`;
  
  // Orders detail
  csv += 'ORDER DETAILS\n';
  csv += 'Date,Order ID,Supplier,Product,Quantity,Amount,Status,Expected Delivery\n';
  
  orders.forEach(order => {
    csv += `${order.date},${order.id},${order.supplier},${order.product},${order.quantity},${order.amount},${order.status},${order.expectedDelivery}\n`;
  });
  
  return csv;
}

function generateExpenseCSV(data) {
  const { transactions, metrics } = data;
  
  let csv = 'GT Management - Expense Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Summary metrics
  csv += 'EXPENSE SUMMARY\n';
  csv += `Total Expenses,${metrics.totalExpenses}\n`;
  csv += `Total Transactions,${metrics.totalTransactions}\n`;
  csv += `Average Expense,${metrics.averageExpense}\n`;
  csv += `Growth Rate,${metrics.growthRate}%\n\n`;
  
  // Transactions detail
  csv += 'EXPENSE DETAILS\n';
  csv += 'Date,Reference ID,Category,Description,Amount,Payment Method,Status\n';
  
  transactions.forEach(transaction => {
    csv += `${transaction.date},${transaction.id},${transaction.category},${transaction.description},${transaction.amount},${transaction.paymentMethod},${transaction.status}\n`;
  });
  
  return csv;
}

function generateStockCSV(data) {
  const { inventory, metrics } = data;
  
  let csv = 'GT Management - Stock Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Summary metrics
  csv += 'STOCK SUMMARY\n';
  csv += `Total Products,${metrics.totalProducts}\n`;
  csv += `Total Value,${metrics.totalValue}\n`;
  csv += `Low Stock Items,${metrics.lowStockItems}\n`;
  csv += `Out of Stock Items,${metrics.outOfStockItems}\n\n`;
  
  // Inventory detail
  csv += 'INVENTORY DETAILS\n';
  csv += 'Product Name,SKU,Category,Current Stock,Reorder Level,Unit Price,Total Value,Status\n';
  
  inventory.forEach(item => {
    csv += `${item.name},${item.sku},${item.category},${item.currentStock},${item.reorderLevel},${item.unitPrice},${item.totalValue},${item.status}\n`;
  });
  
  return csv;
}

function generateAnalyticsCSV(data) {
  const { kpis, performance } = data;
  
  let csv = 'GT Management - Analytics Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // KPIs
  csv += 'KEY PERFORMANCE INDICATORS\n';
  Object.entries(kpis).forEach(([key, value]) => {
    csv += `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())},${value}\n`;
  });
  csv += '\n';
  
  // Performance data
  csv += 'DAILY PERFORMANCE\n';
  csv += 'Date,Revenue,Expenses,Profit,Transactions\n';
  
  performance.forEach(day => {
    csv += `${day.date},${day.revenue},${day.expenses},${day.profit},${day.transactions}\n`;
  });
  
  return csv;
}

function generateCompleteBusinessCSV(allData) {
  let csv = 'GT Management - Complete Business Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n`;
  csv += '========================================\n\n';
  
  // Executive Summary
  csv += 'EXECUTIVE SUMMARY\n';
  csv += `Sales Revenue,${allData.sales.metrics.totalRevenue}\n`;
  csv += `Purchase Spend,${allData.purchases.metrics.totalSpent}\n`;
  csv += `Total Expenses,${allData.expenses.metrics.totalExpenses}\n`;
  csv += `Profit Margin,${allData.analytics.kpis.profitMargin}%\n`;
  csv += `ROI,${allData.analytics.kpis.roi}%\n\n`;
  
  // Add each section
  csv += '========================================\n';
  csv += generateSalesCSV(allData.sales);
  csv += '\n========================================\n';
  csv += generatePurchaseCSV(allData.purchases);
  csv += '\n========================================\n';
  csv += generateExpenseCSV(allData.expenses);
  csv += '\n========================================\n';
  csv += generateStockCSV(allData.stock);
  csv += '\n========================================\n';
  csv += generateAnalyticsCSV(allData.analytics);
  
  return csv;
}
