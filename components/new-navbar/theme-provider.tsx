"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} themes={["light", "dark", "system", "glass"]}>
      {children}
    </NextThemesProvider>
  )
}

