"use client"

import { GitHubIcon, MailIcon, WxIcon } from '@/components/Icon'
import { SparklesText } from '@/components/SparklesText'
import { GithubYearContributions } from '@/components/GithubYearContributions'
import { LinkPreview } from '@/components/LinkPreview'
import { cn } from '@/utils'
import { useTheme } from 'next-themes'
import { useLocale, useTranslations } from 'next-intl'
import profileZh from '@/data/profile.zh.json'
import profileEn from '@/data/profile.en.json'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: GitHubIcon,
    email: MailIcon,
    wechat: WxIcon,
}

/* ========== 动画 Hook ========== */

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el) } },
            { threshold }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold])
    return { ref, inView }
}

/* ========== 主页面 ========== */

export default function Home() {
    const locale = useLocale()
    const t = useTranslations('home')
    const profile = locale === 'en' ? profileEn : profileZh

    return (
        <div className="mx-auto max-w-6xl w-full px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:gap-8">
                <Sidebar profile={profile} t={t} />
                <main className="flex-1 min-w-0 lg:pt-4 pb-4">
                    <SkillSection profile={profile} t={t} />
                    <ProjectSection profile={profile} t={t} />
                    <GithubYearContributions />
                    <Footer profile={profile} t={t} />
                </main>
            </div>
        </div>
    )
}

/* ========== 左侧栏 ========== */

function Sidebar({ profile, t }: { profile: typeof profileZh; t: (key: string) => string }) {
    return (
        <aside className="pt-4 lg:pt-6 lg:w-[280px] shrink-0 pb-6 lg:pb-0 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-4">
                <div className="relative flex-shrink-0 lg:self-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 dark:from-zinc-500 dark:to-zinc-300 blur-md opacity-30" />
                    <Image
                        src={profile.personal.avatar}
                        alt="avatar"
                        width={240}
                        height={240}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-60 lg:h-60 rounded-full border-2 border-white/70 dark:border-zinc-700/70 shadow-md"
                    />
                </div>
                <div className="flex flex-col">
                    <SparklesText text={profile.personal.name} fontSize={30} />
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{profile.personal.role}</span>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {profile.personal.bio}
            </p>

            {profile.personal.motto && (
                <div className="mt-3 px-3 py-2 rounded-lg border-l-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50/80 dark:bg-zinc-800/50">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-wider mb-0.5">
                        {t('mottoLabel')}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium italic">
                        {profile.personal.motto}
                    </p>
                </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row lg:flex-col gap-2 lg:gap-1">
                {profile.contacts.map((item) => {
                    const Icon = iconMap[item.type]
                    if (!Icon) return null
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            target={item.href.startsWith('mailto') ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-3 py-2 lg:px-0 lg:py-1.5 rounded-lg lg:rounded-none text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors text-sm"
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-mono text-xs truncate">{item.value}</span>
                        </a>
                    )
                })}
            </div>
        </aside>
    )
}

/* ========== 技术栈 ========== */

const skillNames: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    react: 'React',
    vue: 'Vue',
    nextjs: 'Next.js',
    tailwindcss: 'Tailwind CSS',
    vite: 'Vite',
    nuxtjs: 'Nuxt.js',
    webpack: 'Webpack',
    rust: 'Rust',
    flutter: 'Flutter',
    vercel: 'Vercel',
    nginx: 'Nginx',
    docker: 'Docker',
}

function SkillSection({ profile, t }: { profile: typeof profileZh; t: (key: string) => string }) {
    const { ref, inView } = useInView(0.05)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    const theme = mounted ? (resolvedTheme === 'dark' ? 'dark' : 'light') : 'light'

    return (
        <section
            ref={ref}
            className={cn(
                'mb-4 transition-all duration-500',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
        >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                {t('skillSectionTitle')}
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {profile.skills.map((code) => (
                    <div
                        key={code}
                        className="group relative flex items-center justify-center aspect-square rounded-md border border-zinc-200/70 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                    >
                        <img
                            src={`https://skillicons.dev/icons?i=${code}&theme=${theme}`}
                            alt={skillNames[code] || code}
                            className="w-8 h-8 object-contain"
                            loading="lazy"
                        />
                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono text-white bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {skillNames[code] || code}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}

/* ========== 项目卡片 ========== */

function ProjectCard({ project, t }: { project: typeof profileZh.projects[0]; t: (key: string) => string }) {
    const cardRef = useRef<HTMLAnchorElement>(null)
    const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
    const { resolvedTheme } = useTheme()

    function handleMouseMove(e: React.MouseEvent) {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        setPos({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        })
    }

    const glowColor = resolvedTheme === 'dark'
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.07)'

    const typeLabel = project.type === "company" ? t('projectTypeCompany') : t('projectTypeOpensource')

    return (
        <LinkPreview url={project.url}>
            <a
                ref={cardRef}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={handleMouseMove}
                className="group relative flex flex-col p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all overflow-hidden min-h-[150px]"
            >
                {/* 聚光效果 */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle 200px at ${pos.x * 100}% ${pos.y * 100}%, ${glowColor}, transparent 80%)`,
                    }}
                />
                <div className="relative z-[1] flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 mb-2">
                        {project.icon && (
                            <Image
                                src={project.icon}
                                alt={project.title}
                                width={32}
                                height={32}
                                className="rounded-md w-8 h-8 object-cover flex-shrink-0"
                            />
                        )}
                        <h3 className="text-xl font-mono font-bold text-zinc-800 dark:text-zinc-100 truncate">
                            {project.title}
                        </h3>
                        {project.type && (
                            <span className={cn(
                                "ml-auto flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded-md border font-mono",
                                project.type === "company"
                                    ? "border-blue-200 dark:border-blue-800 text-blue-500 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30"
                                    : "border-emerald-200 dark:border-emerald-800 text-emerald-500 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/30"
                            )}>
                                {typeLabel}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-2">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                        {project.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="px-1.5 py-0.5 text-[10px] rounded-md border border-zinc-200 dark:border-zinc-600 text-zinc-400 dark:text-zinc-500 bg-zinc-50/80 dark:bg-zinc-800/50"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </a>
        </LinkPreview>
    )
}

function ProjectSection({ profile, t }: { profile: typeof profileZh; t: (key: string) => string }) {
    const { ref, inView } = useInView(0.05)
    return (
        <section
            ref={ref}
            className={cn(
                'transition-all duration-500 delay-100',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
        >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                {t('projectSectionTitle')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
                {profile.projects.map((project, index) => (
                    <ProjectCard key={index} project={project} t={t} />
                ))}
            </div>
        </section>
    )
}

/* ========== Footer ========== */

function Footer({ profile, t }: { profile: typeof profileZh; t: (key: string) => string }) {
    return (
        <footer className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                {t('footerBuiltWith')} · © {new Date().getFullYear()} {profile.personal.name}
            </p>
        </footer>
    )
}
