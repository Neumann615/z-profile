"use client"
import { ThemeSwitch } from '@/components/Header/ThemeSwitch'
import { config } from "@/config"
import { cn } from '@/utils'
import { usePathname, useRouter } from "next/navigation"
import { createElement } from 'react'

export function Navigation() {
    const router = useRouter()
    const pathname = usePathname()

    function handleClick(path: string) {
        // 锚点链接：如果在首页则平滑滚动，否则跳转到首页
        if (path.startsWith('/#')) {
            const hash = path.slice(1) // e.g. "#tech"
            if (pathname === '/') {
                const el = document.querySelector(hash)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                }
            } else {
                router.push(path)
            }
        } else {
            router.push(path)
        }
    }

    function isActive(path: string): boolean {
        if (path.startsWith('/#')) {
            return pathname === '/'
        }
        return pathname === path
    }

    return (
        <div className={"flex items-center justify-center gap-8 max-md:gap-6"}>
            {config.menuData.map((item) => {
                return (
                    <div
                        key={item.path}
                        onClick={() => handleClick(item.path)}
                        className={
                            cn("cursor-pointer tracking-wide duration-500", (isActive(item.path)
                                ? "font-bold text-zinc-600 scale-125"
                                : "font-medium text-zinc-500"))
                        }
                    >
                        <span className={'max-md:hidden text-lg'}> {item.text}</span>
                        <span className={'hidden max-md:block'}>
                            {createElement(item.icon, {
                                className: cn("cursor-pointer tracking-wide duration-500", (isActive(item.path)
                                    ? "text-zinc-700 scale-125"
                                    : "text-zinc-500"))
                            })}
                        </span>
                    </div>
                )
            })}
            <ThemeSwitch></ThemeSwitch>
        </div>
    )
}
