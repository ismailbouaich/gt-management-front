"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [calculationJustPerformed, setCalculationJustPerformed] = useState(false)

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else if (calculationJustPerformed) {
      // Clear the display and start a new input after a calculation
      setDisplay(digit)
      setCalculationJustPerformed(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (calculationJustPerformed) {
      // Start a new decimal input after a calculation
      setDisplay("0.")
      setCalculationJustPerformed(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
    setCalculationJustPerformed(false)
  }

  const handleOperator = (nextOperator) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
    setCalculationJustPerformed(false)
  }

  const performCalculation = () => {
    if (firstOperand === null || operator === null) return Number.parseFloat(display)

    const secondOperand = Number.parseFloat(display)
    let result = 0

    switch (operator) {
      case "+":
        result = firstOperand + secondOperand
        break
      case "-":
        result = firstOperand - secondOperand
        break
      case "*":
        result = firstOperand * secondOperand
        break
      case "/":
        result = firstOperand / secondOperand
        break
      default:
        return secondOperand
    }

    return result
  }

  const handleEquals = () => {
    if (firstOperand === null || operator === null) return

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
    setCalculationJustPerformed(true)
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col rounded-lg border bg-card shadow-sm">
        <div className="p-4">
          <div className="flex h-16 items-center justify-end rounded-md bg-muted px-4">
            <span className="text-3xl font-medium">{display}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 p-4">
          <Button variant="outline" className="text-lg font-medium cursor-pointer" onClick={clearDisplay}>
            C
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium cursor-pointer"
            onClick={() => {
              setDisplay(String(Number.parseFloat(display) * -1))
              setCalculationJustPerformed(false)
            }}
          >
            +/-
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium cursor-pointer"
            onClick={() => {
              setDisplay(String(Number.parseFloat(display) / 100))
              setCalculationJustPerformed(false)
            }}
          >
            %
          </Button>
          <Button variant="secondary" className="text-lg font-medium cursor-pointer" onClick={() => handleOperator("/")}>
            ÷
          </Button>

          {[7, 8, 9].map((num) => (
            <Button key={num} variant="outline" className="text-lg font-medium cursor-pointer" onClick={() => inputDigit(String(num))}>
              {num}
            </Button>
          ))}
          <Button variant="secondary" className="text-lg font-medium cursor-pointer" onClick={() => handleOperator("*")}>
            ×
          </Button>

          {[4, 5, 6].map((num) => (
            <Button key={num} variant="outline" className="text-lg font-medium cursor-pointer" onClick={() => inputDigit(String(num))}>
              {num}
            </Button>
          ))}
          <Button variant="secondary" className="text-lg font-medium cursor-pointer" onClick={() => handleOperator("-")}>
            -
          </Button>

          {[1, 2, 3].map((num) => (
            <Button key={num} variant="outline" className="text-lg font-medium cursor-pointer" onClick={() => inputDigit(String(num))}>
              {num}
            </Button>
          ))}
          <Button variant="secondary" className="text-lg font-medium cursor-pointer" onClick={() => handleOperator("+")}>
            +
          </Button>

          <Button variant="outline" className="col-span-2 text-lg font-medium cursor-pointer" onClick={() => inputDigit("0")}>
            0
          </Button>
          <Button variant="outline" className="text-lg font-medium cursor-pointer" onClick={inputDecimal}>
            .
          </Button>
          <Button variant="primary" className="text-lg font-medium cursor-pointer" onClick={handleEquals}>
            =
          </Button>
        </div>
      </div>
    </div>
  )
}
