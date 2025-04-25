"use client"

import { useState, useRef, useEffect } from "react"
import { CalculatorIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Calculator from "./calculator"

export function DraggableCalculator() {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 600 }) // Default position
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const calculatorRef = useRef(null)

  // Update position to center of screen when component mounts or calculator is toggled
  useEffect(() => {
    if (isVisible) {
      const centerX = Math.max(window.innerWidth / 2 - 160, 0); // 160 is half of calculator width (320px)
      const centerY = Math.max(window.innerHeight / 2 - 200, 0); // 200 is approximately half of calculator height
      setPosition({ x: centerX, y: centerY });
    }
  }, [isVisible]);

  const toggleCalculator = () => {
    setIsVisible(!isVisible)
  }

  const startDrag = (e) => {
    if (calculatorRef.current) {
      const rect = calculatorRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  const onDrag = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const endDrag = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onDrag)
      document.addEventListener("mouseup", endDrag)
    } else {
      document.removeEventListener("mousemove", onDrag)
      document.removeEventListener("mouseup", endDrag)
    }

    return () => {
      document.removeEventListener("mousemove", onDrag)
      document.removeEventListener("mouseup", endDrag)
    }
  }, [isDragging])

  return (
    <>
      {/* Toggle button in bottom left */}
      <Button className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg z-50 cursor-pointer" onClick={toggleCalculator}>
        <CalculatorIcon className="h-6 w-6" />
      </Button>

      {/* Draggable calculator */}
      {isVisible && (
        <div
          ref={calculatorRef}
          className="fixed z-50 shadow-xl rounded-lg border bg-background"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: "320px",
          }}
        >
          <div
            className="bg-muted px-4 py-2 rounded-t-lg cursor-move flex justify-between items-center"
            onMouseDown={startDrag}
          >
            <div className="font-medium">Calculator</div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer" onClick={() => setIsVisible(false)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-2">
            <Calculator />
          </div>
        </div>
      )}
    </>
  )
}
