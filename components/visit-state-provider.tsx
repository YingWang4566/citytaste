"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { DEFAULT_VISIT_STATE } from "@/lib/constants"
import type { LocalVisitState, StatusDefault } from "@/lib/types"

const STORAGE_KEY = "citytaste-visit-state"

type VisitStateContextValue = {
  visitStateBySlug: Record<string, LocalVisitState>
  getVisitState: (slug: string, statusDefault?: StatusDefault) => LocalVisitState
  toggleVisitState: (
    slug: string,
    key: keyof LocalVisitState,
    statusDefault?: StatusDefault,
  ) => void
}

const VisitStateContext = createContext<VisitStateContextValue | null>(null)

function seedDefaultState(statusDefault?: StatusDefault) {
  if (!statusDefault) return DEFAULT_VISIT_STATE

  return {
    ...DEFAULT_VISIT_STATE,
    [statusDefault]: true,
  }
}

export function VisitStateProvider({ children }: { children: ReactNode }) {
  const [visitStateBySlug, setVisitStateBySlug] = useState<
    Record<string, LocalVisitState>
  >(() => {
    if (typeof window === "undefined") {
      return {}
    }

    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) return {}

    try {
      return JSON.parse(raw) as Record<string, LocalVisitState>
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
      return {}
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visitStateBySlug))
  }, [visitStateBySlug])

  const getVisitState = (slug: string, statusDefault?: StatusDefault) => {
    const localState = visitStateBySlug[slug]

    if (!localState) {
      return seedDefaultState(statusDefault)
    }

    return {
      ...seedDefaultState(statusDefault),
      ...localState,
    }
  }

  const toggleVisitState = (
    slug: string,
    key: keyof LocalVisitState,
    statusDefault?: StatusDefault,
  ) => {
    setVisitStateBySlug((current) => {
      const previous = current[slug] ?? seedDefaultState(statusDefault)
      const nextValue = !previous[key]

      if (key === "favorite") {
        return {
          ...current,
          [slug]: {
            ...previous,
            favorite: nextValue,
          },
        }
      }

      return {
        ...current,
        [slug]: {
          ...previous,
          want_to_go: key === "want_to_go" ? nextValue : false,
          visited: key === "visited" ? nextValue : false,
        },
      }
    })
  }

  return (
    <VisitStateContext.Provider
      value={{ visitStateBySlug, getVisitState, toggleVisitState }}
    >
      {children}
    </VisitStateContext.Provider>
  )
}

export function useVisitState() {
  const context = useContext(VisitStateContext)

  if (!context) {
    throw new Error("useVisitState must be used within VisitStateProvider")
  }

  return context
}
