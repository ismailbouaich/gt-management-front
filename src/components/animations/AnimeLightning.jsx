/**
 * AnimeLightning Component
 * 
 * Creates a dramatic lightning effect that strikes text elements from random positions
 * along the top of the screen, making them glow with an electric green effect.
 * 
 * Features:
 * - Random lightning bolts originating from the top edge
 * - Branching electric effects for realism
 * - Text illumination with customizable glow
 * - Full-page background flash effect
 * - Auto-repeating animation cycle
 * 
 * @param {string} targetElements - CSS selector for elements to be struck by lightning (default: ".hero-text")
 * @param {string} color - Primary lightning color in hex format (default: "#3ECF8E" - Supabase green)
 * 
 * Usage:
 * <AnimeLightning targetElements=".my-text" color="#00FF00" />
 */

"use client"

import { useEffect, useRef } from 'react'
import { animate, createScope } from 'animejs'

export default function AnimeLightning({ targetElements = ".hero-text", color = "#3ECF8E" }) {
  // Component refs for DOM manipulation and animation control
  const svgRef = useRef(null)        // SVG container for lightning paths
  const containerRef = useRef(null)  // Main container for positioning
  const scopeRef = useRef(null)      // Anime.js scope for cleanup
  const colorRef = useRef(color)     // Static color reference to avoid re-renders

  useEffect(() => {
    // Debug - check if refs are available
    if (!svgRef.current) {
      console.error("SVG ref is null")
      return
    }
    
    if (!containerRef.current) {
      console.error("Container ref is null")
      return
    }

    // Check if target elements exist in the DOM
    const textElements = document.querySelectorAll(targetElements)
    console.log(`Found ${textElements.length} text elements to animate with selector: ${targetElements}`)
    
    if (textElements.length === 0) {
      console.error("No target elements found for animation")
      return
    }
   
    // Create a scope for all our animations - scoped to document.body for full-page effects
    scopeRef.current = createScope({ root: document.body }).add(self => {
      console.log("Starting lightning animation")
      
      // Function to create lightning that targets text elements
      const createTargetedLightning = (targetEl, index) => {
        if (!targetEl) return null
        
        // Get the target element's position for lightning to strike
        const rect = targetEl.getBoundingClientRect()
        const targetX = rect.left + (rect.width / 2)  // Center X of target
        const targetY = rect.top + (rect.height / 2)   // Center Y of target
        
        // Get container dimensions for starting position calculation
        const heroRect = containerRef.current.getBoundingClientRect()
        
        // CUSTOMIZATION: Change these values to modify lightning origin
        // Generate completely random position along the top edge
        const startX = heroRect.left + (Math.random() * heroRect.width)  // Random X across width  
        const startY = heroRect.top + (Math.random() * 30)               // Small Y variation at top
        
        // Create the main lightning bolt path using SVG path commands
        const points = []
        points.push(`M${startX} ${startY}`)  // Move to starting position
        
        // CUSTOMIZATION: Adjust segments for more/less jagged lightning
        const segments = 6 + Math.floor(Math.random() * 4) // 6-9 segments for jagged look
        
        // Create main lightning path with zigzag effect
        for (let i = 1; i < segments; i++) {
          const progress = i / segments
          const segmentY = startY + (targetY - startY) * progress
          
          // CUSTOMIZATION: Adjust horizontalVariance for more/less zigzag
          const horizontalVariance = 150 * (1 - progress)  // Decreases as we approach target
          const segmentX = startX + ((targetX - startX) * progress) + (Math.random() * horizontalVariance - horizontalVariance/2)
          
          points.push(`L${segmentX} ${segmentY}`)  // Line to this point
        }
        
        points.push(`L${targetX} ${targetY}`)  // Final line to target
        
        // Add branching effects to make lightning more realistic
        // CUSTOMIZATION: Modify branch count and length here
        const branches = []
        if (segments > 6) { // Only add branches for longer bolts
          const branchCount = 1 + Math.floor(Math.random() * 2)  // 1-2 branches
          
          for (let i = 0; i < branchCount; i++) {
            // Pick a random point on the main bolt to branch from (avoid start and end)
            const branchIndex = 1 + Math.floor(Math.random() * (segments - 2))
            const progress = branchIndex / segments
            const branchStartY = startY + (targetY - startY) * progress
            const branchStartX = startX + ((targetX - startX) * progress)
            
            // Create branch path
            const branchPath = [`M${branchStartX} ${branchStartY}`]
            
            // CUSTOMIZATION: Adjust branch length here
            const branchSegments = 2 + Math.floor(Math.random() * 2)  // 2-3 segments per branch
            
            // Direction - branches go away from the main target
            const directionX = (Math.random() < 0.5 ? -1 : 1) * 100
            
            for (let j = 1; j <= branchSegments; j++) {
              const branchProgress = j / branchSegments
              const branchX = branchStartX + directionX * branchProgress + (Math.random() * 40 - 20)
              const branchY = branchStartY + (Math.random() * 40 - 10) * branchProgress
              branchPath.push(`L${branchX} ${branchY}`)
            }
            
            branches.push(branchPath.join(' '))
          }
        }
        
        return {
          path: points.join(' '),
          branches,
          targetX,
          targetY
        }
      }
      
      // Find all target text elements
      const textElements = document.querySelectorAll(targetElements)
      console.log(`Found ${textElements.length} text elements to animate`)
      
      if (textElements.length === 0) return
      
      // Clear any existing SVG elements (except defs)
      const svgElement = svgRef.current
      while (svgElement.firstChild) {
        if (svgElement.lastChild.tagName !== 'defs') {
          svgElement.removeChild(svgElement.lastChild)
        } else {
          break
        }
      }
      
      // Create SVG lightning elements for each target text element
      const bolts = []
      textElements.forEach((el, index) => {
        const boltData = createTargetedLightning(el, index)
        if (boltData) {
          // Create the main lightning bolt path
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          path.setAttribute('d', boltData.path)
          path.setAttribute('stroke', 'url(#lightning-gradient)')
          path.setAttribute('stroke-width', '1')  // CUSTOMIZATION: Adjust thickness here
          path.setAttribute('fill', 'none')
          path.classList.add('anime-lightning-bolt')
          path.style.opacity = '0'                // Start invisible
          path.style.strokeDasharray = '1000'     // For draw-on animation
          path.style.strokeDashoffset = '1000'    // Initial offset for animation
          svgElement.appendChild(path)
          
          // Create branch elements
          const branchPaths = []
          boltData.branches.forEach((branchPath) => {
            const branch = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            branch.setAttribute('d', branchPath)
            branch.setAttribute('stroke', 'url(#lightning-gradient)')
            branch.setAttribute('stroke-width', '2')  // CUSTOMIZATION: Branch thickness
            branch.setAttribute('fill', 'none')
            branch.classList.add('lightning-branch')
            branch.style.opacity = '0'
            branch.style.strokeDasharray = '300'
            branch.style.strokeDashoffset = '300'
            svgElement.appendChild(branch)
            branchPaths.push(branch)
          })
          
          // Store bolt data for animation
          bolts.push({ path, branches: branchPaths, targetEl: el })
        }
      })
      
      // Main animation function - controls the lightning sequence
      const playLightningEffect = () => {
        console.log("Playing lightning effect")
        
        // CUSTOMIZATION: Background flash effect - adjust opacity/duration here
        animate('.lightning-flash', {
          opacity: [0, 0.8, 0],     // Flash brightness (0-1)
          duration: 400,            // Flash duration in ms
          easing: 'steps(3)'        // Steps create flicker effect
        })
        
        // Animate each lightning bolt in sequence
        bolts.forEach((bolt, index) => {
          // CUSTOMIZATION: Adjust delay between bolts here
          const delay = index * 200  // 200ms delay between each bolt
          
          // CUSTOMIZATION: Main bolt animation - adjust speeds/thickness here
          animate(bolt.path, {
            opacity: [0, 1],                    // Fade in
            strokeDashoffset: [1000, 0],        // Draw-on effect
            strokeWidth: [2, 3],                // Thickness animation
            duration: 200,                      // Animation speed
            delay,
            easing: 'linear',
          })
          
          // Animate branch effects if they exist
          bolt.branches.forEach((branch, branchIndex) => {
            animate(branch, {
              opacity: [0, 0.8, 0],              // Quick flash
              strokeDashoffset: [300, 0],        // Draw-on effect
              duration: 150,                     // Faster than main bolt
              delay: delay + 100 + (branchIndex * 50),
              easing: 'linear',
            })
          })
          
          // CUSTOMIZATION: Text glow effect - adjust colors/intensity here
          animate(bolt.targetEl, {
            textShadow: [
              '0 0 5px rgba(62, 207, 142, 0)',    // Start: no glow
              '0 0 20px rgba(62, 207, 142, 1)',   // Peak: bright green
              '0 0 30px rgba(62, 207, 142, 0.9)', // High glow
              '0 0 40px rgba(62, 207, 142, 0.7)', // Medium glow
              '0 0 20px rgba(62, 207, 142, 0.3)'  // End: faint glow
            ],
            color: [
              '#ffffff',   // White
              '#3ECF8E',   // Green flash
              '#ffffff'    // Back to white
            ],
            duration: 1000,  // Text glow duration
            delay: delay + 200,
            easing: 'outExpo',
          })
          
          // CUSTOMIZATION: Bolt fade out - adjust timing here
          animate(bolt.path, {
            opacity: [1, 0.8, 0.4, 0],         // Gradual fade
            strokeWidth: [3, 2, 1, 0.5],       // Shrink as it fades
            duration: 500,                     // Fade duration
            delay: delay + 300,                // Start after glow begins
            easing: 'outExpo',
          })
        })
        
        // CUSTOMIZATION: Repeat timing - adjust frequency here
        setTimeout(playLightningEffect, 4000 + Math.random() * 3000) // 4-7 seconds
      }
      
      // Register the animation function with anime.js scope
      self.add('playLightningEffect', playLightningEffect)
      
      // Start the first animation immediately
      console.log("Starting first animation")
      playLightningEffect()
    })
    
    // Cleanup function - called when component unmounts
    return () => {
      console.log("Cleaning up animation")
      if (scopeRef.current) {
        scopeRef.current.revert()  // Properly cleanup anime.js animations
      }
    }
  }, [targetElements])  // Re-run effect if target selector changes
  
  return (
    // CUSTOMIZATION: Container positioning - absolute covers parent element
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
      {/* Full-page flash overlay - change 'fixed' to 'absolute' to contain within parent */}
      <div className="lightning-flash fixed inset-0 bg-gradient-to-br from-green-400/30 to-cyan-400/30 pointer-events-none z-0" style={{ opacity: 0 }} />
      
      {/* SVG container for lightning paths */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20">
        <defs>
          {/* CUSTOMIZATION: Lightning gradient - modify colors here */}
          <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorRef.current} />
            <stop offset="50%" stopColor="#00FFB3" />
            <stop offset="100%" stopColor="#1DE9B6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}