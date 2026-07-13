"use client"

import { useState, useEffect } from "react"
import { ThemeProvider, useTheme } from "next-themes"
import { GlobalLoading } from "@/components/GlobalLoading"

/**
 * 监听系统主题切换，自动同步页面主题。
 * 使用标准 addEventListener（next-themes v0.3.0 内部用废弃的 addListener，移动端可能失效）。
 */
function SystemThemeListener() {
    const { setTheme } = useTheme()

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)")

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setTheme(e.matches ? "dark" : "light")
        }

        mq.addEventListener("change", handleChange)
        return () => mq.removeEventListener("change", handleChange)
    }, [setTheme])

    return null
}

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SystemThemeListener />
            {isLoading ? (
                <GlobalLoading loadingFinished={() => setIsLoading(false)} />
            ) : (
                children
            )}
        </ThemeProvider>
    )
}
