"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl"

/* ========== 类型 ========== */

interface ContributionDay {
    date: string
    contributionCount: number
    level: number // 0-4，对应 GitHub 贡献等级
}

type ContributionWeek = ContributionDay[]

/* ========== 组件 ========== */

/* ---- 常量 ---- */

const CELL = 11
const GAP = 3
const MONTH_H = 18
const DAY_LABEL_W = 28 // 24px 宽度 + 4px margin-right
const MIN_WEEKS = 15
const MAX_WEEKS = 53 // API 一年最多 53 周

// 深浅主题下的 5 级贡献色（level 0-4，取自 GitHub 官方色板）
const LEVEL_COLORS_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
const LEVEL_COLORS_DARK = ['rgba(255,255,255,0.06)', '#0e4429', '#006d32', '#26a641', '#39d353']

export function GithubYearContributions() {
    const [rawWeeks, setRawWeeks] = useState<ContributionWeek[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const fetchedRef = useRef(false)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)
    useEffect(() => { setMounted(true) }, [])
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [loading]) // loading 变化后 DOM 元素会替换，需要重新绑定

    const isDark = mounted && resolvedTheme === "dark"
    const locale = useLocale()
    const t = useTranslations('github')

    const months = t.raw('months') as string[]
    const days = t.raw('days') as string[]

    /* ---- 日期格式化 ---- */

    function formatDate(dateStr: string): string {
        const [y, m, d] = dateStr.split("-")
        if (locale === 'zh') {
            return `${y}年${parseInt(m)}月${parseInt(d)}日`
        }
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${monthNames[parseInt(m) - 1]} ${parseInt(d)}, ${y}`
    }

    /* ---- 拉取数据 ---- */

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        // 走服务端缓存路由，避免每位访客直接命中第三方限流接口
        fetch("/api/contributions")
            .then((res) => {
                // 限流(429)/服务异常等非 2xx 直接抛错，走降级方案
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                // 限流时也可能返回 200 但带 error 字段，或没有贡献数组，同样走降级
                if (data.error || !Array.isArray(data.contributions)) {
                    throw new Error(data.error || "Invalid response")
                }
                // API 返回扁平逐日数组 {date, count, level}，需按周（周日开头）分组
                const days: ContributionDay[] = data.contributions.map((c: { date: string; count: number; level: number }) => ({
                    date: c.date,
                    contributionCount: c.count,
                    level: c.level,
                }))
                setRawWeeks(groupByWeeks(days))
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    // 按周日开头把逐日数组分组成周
    function groupByWeeks(days: ContributionDay[]): ContributionWeek[] {
        const weeks: ContributionWeek[] = []
        let current: ContributionDay[] = []
        for (const day of days) {
            if (current.length > 0 && new Date(day.date + "T00:00:00Z").getUTCDay() === 0) {
                weeks.push(current)
                current = []
            }
            current.push(day)
        }
        if (current.length) weeks.push(current)
        return weeks
    }

    /* ---- 根据容器宽度动态计算显示多少周 ---- */

    const weekCount = useMemo(() => {
        if (containerWidth === 0) return MAX_WEEKS // 首屏默认全量，ResizeObserver 就绪后再精确
        const available = containerWidth - DAY_LABEL_W
        const perWeek = CELL + GAP // 14px
        const n = Math.floor((available + GAP) / perWeek) // +GAP: 最后一列尾部无 gap
        return Math.max(MIN_WEEKS, Math.min(MAX_WEEKS, n))
    }, [containerWidth])

    /* ---- 截取最近 N 周 + 月份标签 ---- */

    const { weeks, monthLabels } = useMemo(() => {
        if (rawWeeks.length === 0) return { weeks: [], monthLabels: [] as { col: number; label: string }[] }

        const recent = rawWeeks.slice(-weekCount)

        // 月份标签：在月份首次出现的列放置标签；与上一个标签间隔不足 4 列时跳过，避免文字粘连
        const seenMonth = new Set<string>()
        const labels: { col: number; label: string }[] = []
        let lastLabelCol = -Infinity
        for (let wi = 0; wi < recent.length; wi++) {
            for (let di = 0; di < recent[wi].length; di++) {
                const day = recent[wi][di]
                if (!day) continue
                const mKey = day.date.slice(0, 7)
                if (!seenMonth.has(mKey)) {
                    seenMonth.add(mKey)
                    if (wi - lastLabelCol < 4) continue
                    lastLabelCol = wi
                    const m = parseInt(day.date.split("-")[1]) - 1
                    labels.push({ col: wi, label: months[m] })
                }
            }
        }

        return { weeks: recent, monthLabels: labels }
    }, [rawWeeks, months, weekCount])

    /* ---- 单元格颜色 ---- */

    function cellColor(day: ContributionDay | null): string {
        if (!day) return "transparent"
        return (isDark ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT)[day.level]
    }

    /* ---- 加载态 ---- */

    if (loading) {
        return (
            <section className="mt-4" ref={containerRef}>
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                    {t('contributionsSectionTitle')}
                </h2>
                <div className="animate-pulse">
                    <div className="flex" style={{ marginLeft: 28, gap: GAP }}>
                        {Array.from({ length: weekCount }, (_, wi) => (
                            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                                {Array.from({ length: 7 }, (_, i) => (
                                    <div key={i} className="rounded-sm bg-zinc-200 dark:bg-zinc-700" style={{ width: CELL, height: CELL }} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    /* ---- 错误降级 ---- */

    if (error) {
        return (
            <section className="mt-4" ref={containerRef}>
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                    {t('contributionsSectionTitle')}
                </h2>
                <img
                    src="https://ghchart.rshah.org/Neumann615"
                    alt="GitHub Contributions"
                    className="w-full rounded-md dark:invert dark:hue-rotate-180"
                />
            </section>
        )
    }

    if (weeks.length === 0) return null

    /* ---- 渲染 ---- */

    // 星期标签索引：中文一三五日，英文 Sun/Tue/Thu/Sat
    const visibleDayIndices = locale === 'zh' ? [1, 3, 5, 0] : [0, 2, 4, 6]

    return (
        <section className="mt-4" ref={containerRef}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                {t('sectionTitle')}
            </h2>

            {/* 可滚动容器 */}
            <div className="overflow-x-auto -mx-4 px-4 pb-1">
                <div className="inline-flex min-w-max" style={{ gap: 0 }}>
                    {/* 左侧星期标签 */}
                    <div className="flex flex-col flex-shrink-0 mr-1" style={{ paddingTop: MONTH_H, gap: GAP }}>
                        {days.map((label, i) => (
                            <div
                                key={i}
                                className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center justify-end"
                                style={{
                                    height: CELL,
                                    width: 24,
                                    visibility: visibleDayIndices.includes(i) ? "visible" : "hidden",
                                }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* 右侧网格区 */}
                    <div>
                        {/* 月份行 */}
                        <div className="flex" style={{ height: MONTH_H, gap: GAP }}>
                            {weeks.map((_, wi) => {
                                const ml = monthLabels.find((m) => m.col === wi)
                                return (
                                    <div
                                        key={wi}
                                        className="relative flex-shrink-0"
                                        style={{ width: CELL, height: MONTH_H }}
                                    >
                                        {ml && (
                                            <span className="absolute left-0 text-[9px] text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                                                {ml.label}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* 格子：7 行 × N 列 */}
                        {Array.from({ length: 7 }, (_, rowIdx) => (
                            <div
                                key={rowIdx}
                                className="flex"
                                style={{ gap: GAP, marginBottom: rowIdx < 6 ? GAP : 0 }}
                            >
                                {weeks.map((week, wi) => {
                                    const day = week[rowIdx] || null
                                    return (
                                        <div
                                            key={wi}
                                            className="flex-shrink-0 rounded-sm cursor-pointer hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-400 transition-all"
                                            style={{
                                                width: CELL,
                                                height: CELL,
                                                backgroundColor: cellColor(day),
                                            }}
                                            onMouseMove={(e) => {
                                                if (!day) return
                                                setTooltip({
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                    text: `${formatDate(day.date)} ${t('contributionsCount', { count: day.contributionCount })}`,
                                                })
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 悬停提示（fixed 定位，避免被 overflow-x-auto 裁剪） */}
            {tooltip && (
                <div
                    className="fixed z-50 pointer-events-none px-2 py-1 rounded-md bg-zinc-900 text-zinc-100 text-xs whitespace-nowrap shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
                    style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
                >
                    {tooltip.text}
                </div>
            )}
        </section>
    )
}

export default GithubYearContributions
