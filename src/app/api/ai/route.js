import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Action detection for report generation and other tasks
const detectActions = (message) => {
  const lowerMessage = message.toLowerCase();
  const actions = [];

  // Report generation actions
  if (lowerMessage.includes('generate') || lowerMessage.includes('download') || lowerMessage.includes('export') || lowerMessage.includes('create report')) {
    if (lowerMessage.includes('sales') && lowerMessage.includes('report')) {
      actions.push({ type: 'GENERATE_REPORT', reportType: 'sales', description: 'Generate Sales Report' });
    }
    if (lowerMessage.includes('purchase') && lowerMessage.includes('report')) {
      actions.push({ type: 'GENERATE_REPORT', reportType: 'purchases', description: 'Generate Purchase Report' });
    }
    if (lowerMessage.includes('expense') && lowerMessage.includes('report')) {
      actions.push({ type: 'GENERATE_REPORT', reportType: 'expenses', description: 'Generate Expense Report' });
    }
    if (lowerMessage.includes('stock') || lowerMessage.includes('inventory')) {
      if (lowerMessage.includes('report')) {
        actions.push({ type: 'GENERATE_REPORT', reportType: 'stock', description: 'Generate Stock Report' });
      }
    }
    if (lowerMessage.includes('analytic') && lowerMessage.includes('report')) {
      actions.push({ type: 'GENERATE_REPORT', reportType: 'analytics', description: 'Generate Analytics Report' });
    }
    if ((lowerMessage.includes('all') || lowerMessage.includes('complete')) && lowerMessage.includes('report')) {
      actions.push({ type: 'GENERATE_REPORT', reportType: 'all', description: 'Generate Complete Business Report' });
    }
  }

  // Navigation actions
  if (lowerMessage.includes('show') || lowerMessage.includes('open') || lowerMessage.includes('go to')) {
    if (lowerMessage.includes('dashboard')) {
      actions.push({ type: 'NAVIGATE', path: '/dashboard', description: 'Navigate to Dashboard' });
    }
    if (lowerMessage.includes('report') && !actions.some(a => a.type === 'GENERATE_REPORT')) {
      actions.push({ type: 'NAVIGATE', path: '/reports', description: 'Navigate to Reports Page' });
    }
    if (lowerMessage.includes('product') || lowerMessage.includes('inventory')) {
      actions.push({ type: 'NAVIGATE', path: '/products', description: 'Navigate to Products Page' });
    }
    if (lowerMessage.includes('customer')) {
      actions.push({ type: 'NAVIGATE', path: '/customers', description: 'Navigate to Customers Page' });
    }
    if (lowerMessage.includes('transaction')) {
      actions.push({ type: 'NAVIGATE', path: '/transactions', description: 'Navigate to Transactions Page' });
    }
  }

  if (lowerMessage.includes('create product') || lowerMessage.includes('add product')) {
  actions.push({
    type: 'CREATE_PRODUCT',
    description: 'Opening product creation form',
    path: '/dashboard/products/create'
  });
}

if (lowerMessage.includes('create transaction') || lowerMessage.includes('new sale')) {
  actions.push({
    type: 'CREATE_TRANSACTION',
    description: 'Opening transaction form',
    path: '/dashboard/transactions/sales/create'
  });
}

if (lowerMessage.includes('create customer')) {
  actions.push({
    type: 'CREATE_CUSTOMER', 
    description: 'Opening customer creation form',
    path: '/dashboard/customers/create'
  });
}

  return actions;
};

// Enhanced fallback responses with action integration
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  const actions = detectActions(message);
  
  if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
    let response = "I can help you with inventory management! Here are some key features:\n\n• Monitor stock levels and set up low-stock alerts\n• Track product movements and transfers\n• Generate inventory reports and analytics\n• Set up automated reorder points\n• Manage product categories and variations";
    
    if (actions.some(a => a.type === 'GENERATE_REPORT' && a.reportType === 'stock')) {
      response += "\n\n🔄 I'll generate your stock report now...";
    }
    return response;
  }
  
  if (lowerMessage.includes('sales') || lowerMessage.includes('sell')) {
    let response = "For sales management, I can assist you with:\n\n• Processing sales transactions through POS\n• Analyzing sales performance and trends\n• Managing customer relationships and history\n• Creating sales reports and dashboards\n• Setting up pricing strategies\n• Tracking sales team performance";
    
    if (actions.some(a => a.type === 'GENERATE_REPORT' && a.reportType === 'sales')) {
      response += "\n\n📊 Generating your sales report...";
    }
    return response;
  }
  
  if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
    return "Customer management features include:\n\n• Maintaining customer profiles and contact information\n• Tracking purchase history and preferences\n• Managing customer credit limits and balances\n• Setting up loyalty programs and discounts\n• Generating customer analytics and insights\n• Handling customer support tickets\n\nHow can I help you with customer management?";
  }
  
  if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
    let response = "GT Management offers comprehensive reporting:\n\n• Financial reports (P&L, Balance Sheet, Cash Flow)\n• Sales analytics and performance metrics\n• Inventory turnover and stock reports\n• Customer behavior analysis\n• Production efficiency reports\n• Custom dashboard creation";
    
    if (actions.length > 0) {
      const reportActions = actions.filter(a => a.type === 'GENERATE_REPORT');
      if (reportActions.length > 0) {
        response += "\n\n📈 I'll generate the requested reports for you...";
      }
    } else {
      response += "\n\nWhich type of report are you interested in? I can generate:\n• Sales reports\n• Purchase reports\n• Expense reports\n• Stock/inventory reports\n• Analytics reports";
    }
    return response;
  }
  
  if (lowerMessage.includes('expense') || lowerMessage.includes('cost')) {
    let response = "Expense management capabilities:\n\n• Track and categorize business expenses\n• Monitor spending patterns and budgets\n• Generate expense reports and analytics\n• Manage vendor payments and invoices\n• Set up approval workflows\n• Integrate with accounting systems";
    
    if (actions.some(a => a.type === 'GENERATE_REPORT' && a.reportType === 'expenses')) {
      response += "\n\n💰 Generating your expense report...";
    }
    return response;
  }
  
  if (lowerMessage.includes('purchase') || lowerMessage.includes('procurement')) {
    let response = "Purchase management features:\n\n• Create and manage purchase orders\n• Track supplier relationships and performance\n• Monitor purchase costs and trends\n• Generate purchase analytics\n• Manage approval workflows\n• Track delivery and payment status";
    
    if (actions.some(a => a.type === 'GENERATE_REPORT' && a.reportType === 'purchases')) {
      response += "\n\n🛒 Generating your purchase report...";
    }
    return response;
  }
  
  if (lowerMessage.includes('user') || lowerMessage.includes('permission') || lowerMessage.includes('role')) {
    return "User management capabilities:\n\n• Create and manage user accounts\n• Set up role-based permissions\n• Define access levels for different modules\n• Track user activity and login history\n• Manage team hierarchies\n• Configure system security settings\n\nWhat user management task can I help you with?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return "Hello! I'm your GT Management AI assistant. I can help you with:\n\n• Product and inventory management\n• Sales transactions and POS operations\n• Customer relationship management\n• Financial reporting and analytics\n• User permissions and system settings\n• Production planning and scheduling\n\n💡 Try saying: 'Generate sales report' or 'Show me inventory analytics'";
  }
  
  return "I'm here to help you with GT Management! I can assist with inventory, sales, customers, reports, user management, and more. I can also generate reports and navigate to different sections.\n\n🔧 Try commands like:\n• 'Generate sales report'\n• 'Download inventory report'\n• 'Show analytics dashboard'\n• 'Go to transactions page'";
};

export async function POST(request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Detect actions in the user's message
    const actions = detectActions(message);

    // Try Google Gemini first (primary AI service)
    if (process.env.GOOGLE_AI_API_KEY) {
      console.log('Using Google Gemini AI...');
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are an AI assistant for GT Management, a comprehensive business management application. 
        You help users with:
        - Product management and inventory
        - Sales transactions and POS operations
        - Customer management
        - Financial reports and analytics
        - User management and permissions
        - Production planning
        - Transaction management (purchases, sales, transfers)
        - Cheque management
        
        IMPORTANT: When users ask to generate, download, export, or create reports, acknowledge their request and mention that you'll help generate the report. Be specific about what type of report they're requesting.
        
        Available report types:
        - Sales reports (revenue, transactions, performance)
        - Purchase reports (orders, spending, suppliers)
        - Expense reports (costs, categories, trends)
        - Stock/Inventory reports (levels, movements, analytics)
        - Analytics reports (comprehensive business insights)
        
        If someone asks for navigation (like "show dashboard" or "go to reports"), acknowledge that you can help them navigate there.
        
        Provide helpful, accurate, and business-focused responses. Always be professional and concise.
        Current context: ${context || 'General assistance'}
        
        User question: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return Response.json({ 
          response: text,
          actions: actions,
          source: 'gemini'
        });

      } catch (geminiError) {
        console.log('Google Gemini failed, trying Anthropic...', geminiError.message);
        
        // Fall back to Anthropic if Gemini fails
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            const systemPrompt = `You are an AI assistant for GT Management, a comprehensive business management application. 
            You help users with:
            - Product management and inventory
            - Sales transactions and POS operations
            - Customer management
            - Financial reports and analytics
            - User management and permissions
            - Production planning
            - Transaction management (purchases, sales, transfers)
            - Cheque management
            
            IMPORTANT: When users ask to generate, download, export, or create reports, acknowledge their request and mention that you'll help generate the report. Be specific about what type of report they're requesting.
            
            Available report types:
            - Sales reports (revenue, transactions, performance)
            - Purchase reports (orders, spending, suppliers)
            - Expense reports (costs, categories, trends)
            - Stock/Inventory reports (levels, movements, analytics)
            - Analytics reports (comprehensive business insights)
            
            If someone asks for navigation (like "show dashboard" or "go to reports"), acknowledge that you can help them navigate there.
            
            Provide helpful, accurate, and business-focused responses. Always be professional and concise.
            Current context: ${context || 'General assistance'}`;

            const response = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 1000,
              temperature: 0.7,
              system: systemPrompt,
              messages: [
                {
                  role: 'user',
                  content: message
                }
              ]
            });

            return Response.json({ 
              response: response.content[0].text,
              actions: actions,
              source: 'anthropic'
            });

          } catch (anthropicError) {
            console.log('Both AI services failed, using fallback...', anthropicError.message);
          }
        }
      }
    }

    // If no API keys are available or both AI services fail, use fallback
    console.log('Using fallback AI responses - API services not available or failed');
    return Response.json({ 
      response: getFallbackResponse(message),
      actions: actions,
      source: 'fallback'
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return Response.json(
      { error: 'Failed to process AI request', details: error.message }, 
      { status: 500 }
    );
  }
}
