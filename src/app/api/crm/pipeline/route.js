import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch CRM pipeline data
export async function GET(request) {
  try {
    await delay()
    
    // Get pipeline configuration from mock data
    const pipelineConfig = mockData.crmData.pipeline
    
    // Get opportunities to calculate value and count per stage
    const opportunities = mockData.crmData.opportunities || []
    
    // Calculate stats for each stage
    const stages = pipelineConfig.stages.map(stage => {
      // Filter opportunities in this stage
      const stageOpportunities = opportunities.filter(
        opp => opp.stageId === stage.id || opp.stage === stage.name
      )
      
      // Calculate total value in this stage
      const value = stageOpportunities.reduce(
        (sum, opp) => sum + (parseFloat(opp.amount) || 0), 
        0
      )
      
      return {
        ...stage,
        count: stageOpportunities.length,
        value
      }
    })
    
    // Calculate totals
    const totalOpportunities = opportunities.length
    const totalValue = opportunities.reduce(
      (sum, opp) => sum + (parseFloat(opp.amount) || 0), 
      0
    )
      return Response.json({
      success: true,
      pipeline: {
        stages,
        totalOpportunities,
        totalValue
      },
      opportunities: opportunities
    })
  } catch (error) {
    console.error('Error in pipeline API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch pipeline data' 
      }, 
      { status: 500 }
    )
  }
}
