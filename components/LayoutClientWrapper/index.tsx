"use client"

import { useState, useEffect } from "react"
import { ThemeProvider, useTheme } from "next-themes"
import { GlobalLoading } from "@/components/GlobalLoading"

function SystemThemeListener() {
    const { setTheme } = useTheme()

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)")
        function handleChange(e: MediaQueryListEvent) {
            setTheme(e.matches ? "dark" : "light")
        }
        mq.addEventListener("change", handleChange)
        return () => mq.removeEventListener("change", handleChange)
    }, [setTheme])

    return null
}

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    if (isLoading) {
        return (
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <GlobalLoading loadingFinished={() => setIsLoading(false)} />
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SystemThemeListener />
            {children}
        </ThemeProvider>
    )
}
