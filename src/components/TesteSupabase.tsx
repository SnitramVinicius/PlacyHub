"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function TesteSupabase() {
  useEffect(() => {
    async function fetchSpaces() {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")

      console.log("DADOS:", data)
      console.log("ERRO:", error)
    }

    fetchSpaces()
  }, [])

  return null
}