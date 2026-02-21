"use client"

import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Au chargement, on vérifie la préférence
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark")
    setIsDark(isDarkTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-dark/50 text-gray-500 dark:text-gray-400 hover:text-secondary transition-all active:scale-95"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}