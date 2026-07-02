"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export type TimerState = "idle" | "running" | "paused"

interface UseTimerProps {
  initialTime: number // in seconds
  onComplete?: () => void
  storageKey?: string
}

interface UseTimerReturn {
  time: number
  state: TimerState
  start: () => void
  pause: () => void
  reset: () => void
  setTime: (time: number) => void
  isLoaded: boolean
}

export function useTimer({ initialTime, onComplete, storageKey }: UseTimerProps): UseTimerReturn {
  const [time, setTimeState] = useState(initialTime)
  const [state, setState] = useState<TimerState>("idle")
  const [isLoaded, setIsLoaded] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)
  
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (storageKey && !isLoaded) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.state === "running" && parsed.targetEndTime) {
             const remaining = Math.floor((parsed.targetEndTime - Date.now()) / 1000)
             if (remaining <= 0) {
                 setTimeState(0)
                 setState("idle")
                 localStorage.removeItem(storageKey)
                 // Wait a tick before calling onComplete to avoid React warnings during render phase
                 setTimeout(() => onCompleteRef.current?.(), 0)
             } else {
                 setTimeState(remaining)
                 setState("running")
             }
          } else {
             setTimeState(parsed.time)
             setState(parsed.state)
          }
        }
      } catch (e) {}
      setIsLoaded(true)
    } else if (!storageKey && !isLoaded) {
      setIsLoaded(true)
    }
  }, [storageKey, isLoaded])

  useEffect(() => {
    if (isLoaded && storageKey) {
      if (state === "idle" && time === initialTime) {
         // Don't save default state
      } else {
         const data = {
           time,
           state,
           targetEndTime: state === "running" ? Date.now() + (time * 1000) : null
         }
         localStorage.setItem(storageKey, JSON.stringify(data))
      }
    }
  }, [time, state, storageKey, initialTime, isLoaded])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (state === "running" && time > 0) {
      intervalRef.current = setInterval(() => {
        setTimeState((prev) => {
          if (prev <= 1) {
            setState("idle")
            if (storageKey) localStorage.removeItem(storageKey)
            onCompleteRef.current?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state, time, storageKey])

  const start = useCallback(() => {
    if (time > 0) {
      setState("running")
    }
  }, [time])

  const pause = useCallback(() => {
    setState("paused")
  }, [])

  const reset = useCallback(() => {
    setState("idle")
    setTimeState(initialTime)
    if (storageKey && typeof window !== "undefined") {
       localStorage.removeItem(storageKey)
    }
  }, [initialTime, storageKey])

  const setTime = useCallback((newTime: number) => {
    setTimeState(newTime)
  }, [])

  return { time, state, start, pause, reset, setTime, isLoaded }
}
