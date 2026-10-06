'use client';
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { flushSync } from 'react-dom'
import { useRef } from 'react'

export function ThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme()
    const t = useTranslations('a11y')
    const darkBtnRef = useRef<HTMLButtonElement>(null)

    function toggleDarkMode() {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark'

        if (
            !darkBtnRef.current ||
            !document.startViewTransition
        ) {
            setTheme(next)
            return
        }
        const { top, left, width, height } = darkBtnRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const right = window.innerWidth - left
        const bottom = window.innerHeight - top
        const maxRadius = Math.hypot(
            Math.max(left, right),
            Math.max(top, bottom),
        )
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(next)
            })
        })
        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
            ]
            const clipPath2 = [
                `circle(${maxRadius}px at ${x}px ${y}px)`,
                `circle(0px at ${x}px ${y}px)`,
            ]
            document.documentElement.animate(
                {
                    clipPath: resolvedTheme === 'light' ? clipPath : clipPath2
                },
                {
                    duration: 600,
                    easing: 'ease-in',
                    pseudoElement: resolvedTheme === 'light' ? '::view-transition-new(root)' : '::view-transition-old(root)',
                }
            )
        })
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            ref={darkBtnRef}
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDark ? t('switchToLight') : t('switchToDark')}
            className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500"
        >
            {isDark ? (
                <Moon className="w-[22px] h-[22px] text-zinc-500 dark:text-zinc-400" />
            ) : (
                <Sun className="w-[22px] h-[22px] text-zinc-500" />
            )}
        </button>
    )
}
