import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Fallback responses for demo purposes
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
    return "I can help you with inventory management! Here are some key features:\n\n• Monitor stock levels and set up low-stock alerts\n• Track product movements and transfers\n• Generate inventory reports and analytics\n• Set up automated reorder points\n• Manage product categories and variations\n\nWould you like me to explain any specific inventory feature?";
  }
  
  if (lowerMessage.includes('sales') || lowerMessage.includes('sell')) {
    return "For sales management, I can assist you with:\n\n• Processing sales transactions through POS\n• Analyzing sales performance and trends\n• Managing customer relationships and history\n• Creating sales reports and dashboards\n• Setting up pricing strategies\n• Tracking sales team performance\n\nWhat specific sales aspect would you like to explore?";
  }
  
  if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
    return "Customer management features include:\n\n• Maintaining customer profiles and contact information\n• Tracking purchase history and preferences\n• Managing customer credit limits and balances\n• Setting up loyalty programs and discounts\n• Generating customer analytics and insights\n• Handling customer support tickets\n\nHow can I help you with customer management?";
  }
  
  if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
    return "GT Management offers comprehensive reporting:\n\n• Financial reports (P&L, Balance Sheet, Cash Flow)\n• Sales analytics and performance metrics\n• Inventory turnover and stock reports\n• Customer behavior analysis\n• Production efficiency reports\n• Custom dashboard creation\n\nWhich type of report are you interested in?";
  }
  
  if (lowerMessage.includes('user') || lowerMessage.includes('permission') || lowerMessage.includes('role')) {
    return "User management capabilities:\n\n• Create and manage user accounts\n• Set up role-based permissions\n• Define access levels for different modules\n• Track user activity and login history\n• Manage team hierarchies\n• Configure system security settings\n\nWhat user management task can I help you with?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return "Hello! I'm your GT Management AI assistant. I'm here to help you with:\n\n• Product and inventory management\n• Sales transactions and POS operations\n• Customer relationship management\n• Financial reporting and analytics\n• User permissions and system settings\n• Production planning and scheduling\n\nWhat would you like to know about?";
  }
  
  return "I'm here to help you with GT Management! I can assist with inventory, sales, customers, reports, user management, and more. Could you please rephrase your question or ask about a specific business area? For example:\n\n• 'How do I manage inventory?'\n• 'Show me sales analytics'\n• 'Help with customer management'\n• 'Explain user permissions'";
};

export async function POST(request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

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
        
        Provide helpful, accurate, and business-focused responses. Always be professional and concise.
        Current context: ${context || 'General assistance'}
        
        User question: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return Response.json({ 
          response: text,
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
