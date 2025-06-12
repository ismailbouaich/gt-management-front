"use client"

import React, { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {
  CSS,
} from '@dnd-kit/utilities'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from 'lucide-react'

// Draggable Opportunity Card Component
function SortableOpportunityCard({ opportunity, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
    data: {
      type: 'opportunity',
      opportunity,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200
        ${isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}
        ${isOverlay ? 'rotate-2 shadow-xl' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-0">
        <div className="space-y-2">
          {/* Drag Handle and Title */}
          <div className="flex items-start gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-tight truncate">{opportunity.name}</h4>
            </div>
          </div>
          
          {/* Company and Amount */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate flex-1 mr-2">
              {opportunity.company}
            </span>
            <Badge variant="outline" className="text-xs font-medium">
              ${opportunity.amount?.toLocaleString()}
            </Badge>
          </div>
          
          {/* Priority and Probability */}
          <div className="flex items-center justify-between">
            <Badge className={`text-xs ${getPriorityColor(opportunity.priority)}`}>
              {opportunity.priority || 'Medium'}
            </Badge>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-600">
                {opportunity.probability || 0}%
              </span>
            </div>
          </div>
          
          {/* Expected Close Date */}
          {opportunity.expectedCloseDate && (
            <div className="text-xs text-muted-foreground">
              Close: {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pipeline Stage Column Component
function PipelineStage({ stage, opportunities, onAddOpportunity }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: 'stage',
      stage,
    },
  })

  return (
    <div className="space-y-3 min-h-[400px]">
      {/* Stage Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color || '#6b7280' }}
            />
            <h3 className="font-medium text-sm">{stage.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {opportunities.length} deals • ${stage.value?.toLocaleString() || '0'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onAddOpportunity(stage.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Opportunities Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          space-y-2 min-h-[350px] p-2 rounded-lg transition-colors duration-200
          ${isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'border-2 border-transparent'}
        `}
      >
        {/* Opportunities List */}
        <SortableContext 
          items={opportunities.map(opp => opp.id)}
          strategy={verticalListSortingStrategy}
        >
          {opportunities.map((opportunity) => (
            <SortableOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </SortableContext>
        
        {/* Empty State */}
        {opportunities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-sm">No opportunities</div>
            <div className="text-xs">Drag deals here</div>
          </div>
        )}
        
        {/* Drop Zone Indicator */}
        {isOver && opportunities.length === 0 && (
          <div className="text-center py-4 text-blue-600 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
            <div className="text-sm font-medium">Drop opportunity here</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Draggable Pipeline Component
export function DraggablePipeline({ 
  pipeline, 
  opportunities, 
  onUpdateOpportunity,
  onAddOpportunity = () => {} 
}) {
  const [activeId, setActiveId] = useState(null)
  const [draggedOpportunity, setDraggedOpportunity] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Organize opportunities by stage
  const pipelineData = useMemo(() => {
    console.log('DraggablePipeline received:', {
      pipeline: pipeline,
      opportunitiesCount: opportunities?.length || 0,
      stages: pipeline.stages?.length || 0
    })

    const stages = pipeline.stages || []
    return stages.map(stage => {
      const stageOpportunities = opportunities.filter(opp => 
        opp.stageId === stage.id || opp.stage === stage.name
      )
      const stageValue = stageOpportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
      
      console.log(`Stage ${stage.name}:`, {
        stageId: stage.id,
        opportunities: stageOpportunities.length,
        value: stageValue
      })
      
      return {
        ...stage,
        count: stageOpportunities.length,
        value: stageValue,
        opportunities: stageOpportunities
      }
    })
  }, [opportunities, pipeline.stages])

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
    
    // Find the dragged opportunity
    const draggedOpp = opportunities.find(opp => opp.id === active.id)
    setDraggedOpportunity(draggedOpp)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    setActiveId(null)
    setDraggedOpportunity(null)

    if (!over) return

    const activeOpportunity = opportunities.find(opp => opp.id === active.id)
    if (!activeOpportunity) return

    // Check if dropped on a different stage
    const overData = over.data.current
    
    if (overData?.type === 'stage') {
      // Dropped on a stage
      const newStageId = over.id
      const newStage = pipeline.stages.find(s => s.id === newStageId)
      
      if (newStage && (activeOpportunity.stageId !== newStageId)) {
        // Update opportunity stage
        const updatedOpportunity = {
          ...activeOpportunity,
          stageId: newStageId,
          stage: newStage.name,
          probability: newStage.probability || activeOpportunity.probability,
          updatedAt: new Date().toISOString()
        }
        
        onUpdateOpportunity?.(updatedOpportunity)
      }
    } else if (overData?.type === 'opportunity') {
      // Dropped on another opportunity (reordering within stage)
      const overOpportunity = opportunities.find(opp => opp.id === over.id)
      if (overOpportunity && activeOpportunity.stageId === overOpportunity.stageId) {
        // Handle reordering within the same stage if needed        console.log('Reordering within stage:', activeOpportunity.stage)
      }
    }
  }

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Pipeline Stages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 min-h-[500px]">
          {pipelineData.map((stage) => (
            <PipelineStage
              key={stage.id}
              stage={stage}
              opportunities={stage.opportunities}
              onAddOpportunity={onAddOpportunity}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && draggedOpportunity ? (
            <SortableOpportunityCard
              opportunity={draggedOpportunity}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
