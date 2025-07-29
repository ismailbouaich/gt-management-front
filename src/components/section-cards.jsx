"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dashboardService } from "@/services/dashboardService"

export function SectionCards() {
  const [cardData, setCardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCardData()
  }, [])

  const fetchCardData = async () => {
    try {
      setLoading(true)
      const data = await dashboardService.getSectionCardData()
      setCardData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching card data:', err)
      setError(err.message)
      // Fallback to static data
      setCardData([
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: '$1,250.00',
          change: 12.5,
          trend: 'up',
          description: 'Total revenue this month',
          footerText: 'Visitors for the last 6 months'
        },
        {
          id: 'customers',
          title: 'New Customers',
          value: '1,234',
          change: -20,
          trend: 'down',
          description: 'New customer acquisitions',
          footerText: 'Acquisition needs attention'
        },
        {
          id: 'accounts',
          title: 'Active Accounts',
          value: '45,678',
          change: 12.5,
          trend: 'up',
          description: 'Currently active user accounts',
          footerText: 'Engagement exceed targets'
        },
        {
          id: 'growth',
          title: 'Growth Rate',
          value: '4.5%',
          change: 4.5,
          trend: 'up',
          description: 'Overall business growth rate',
          footerText: 'Meets growth projections'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? IconTrendingUp : IconTrendingDown
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  const getTrendText = (change, trend, title) => {
    const direction = trend === 'up' ? 'up' : 'down'
    const prefix = trend === 'up' ? '+' : ''
    
    if (title === 'New Customers' && trend === 'down') {
      return `Down ${Math.abs(change)}% this period`
    }
    if (title === 'Total Revenue' && trend === 'up') {
      return `Trending up this month`
    }
    if (title === 'Active Accounts' && trend === 'up') {
      return `Strong user retention`
    }
    if (title === 'Growth Rate' && trend === 'up') {
      return `Steady performance increase`
    }
    
    return `${prefix}${change}% ${direction} this period`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="@container/card animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-32"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5">
                <div className="h-4 bg-muted rounded w-40"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      {cardData.map((card, index) => {
        const TrendIcon = getTrendIcon(card.trend)
        
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.01,
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.99 }}
          >
            <Card className="@container/card relative overflow-hidden border transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-primary/5">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-card dark:bg-card/50"
                animate={{ 
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 2
                }}
              />
              <CardHeader className="relative z-10">
                <CardDescription>{card.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    {card.value}
                  </motion.span>
                </CardTitle>
                <CardAction>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Badge variant="outline" className={getTrendColor(card.trend)}>
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {card.trend === 'up' ? '+' : ''}{card.change}%
                    </Badge>
                  </motion.div>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm relative z-10">
                <motion.div 
                  className="line-clamp-1 flex gap-2 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                >
                  {getTrendText(card.change, card.trend, card.title)} 
                  <TrendIcon className="size-4" />
                </motion.div>
                <motion.div 
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                >
                  {card.footerText}
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
