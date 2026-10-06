import { NextResponse } from 'next/server'

// 服务端缓存一小时：访客不再直接命中第三方限流接口
// 配置 GITHUB_TOKEN 后走 GitHub 官方 GraphQL，统计包含私有仓库贡献（与登录态 GitHub 一致）；
// 未配置或调用失败时自动回退到第三方公开数据源（仅公开贡献）
export const revalidate = 3600

const LOGIN = 'Neumann615'
const FALLBACK = 'https://github-contributions-api.jogruber.de/v4/Neumann615?y=last'

type ContributionDay = { date: string; count: number; level: number }

// GitHub 网页按日历内最大值动态分四级，这里用同样的近似分位
function toLevel(count: number, max: number): number {
    if (count <= 0) return 0
    const q = max / 4
    if (count <= q) return 1
    if (count <= q * 2) return 2
    if (count <= q * 3) return 3
    return 4
}

async function fetchFromGitHub(token: string) {
    const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays { date contributionCount }
            }
          }
        }
      }
    }`

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: { login: LOGIN } }),
        next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`)

    const json = await res.json()
    const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
    if (!Array.isArray(weeks)) throw new Error('Invalid GitHub response')

    const days: ContributionDay[] = weeks.flatMap((week: { contributionDays: { date: string; contributionCount: number }[] }) =>
        week.contributionDays.map(day => ({
            date: day.date.slice(0, 10),
            count: day.contributionCount,
            level: 0,
        }))
    )
    const max = Math.max(1, ...days.map(d => d.count))
    days.forEach(d => { d.level = toLevel(d.count, max) })

    return { total: { lastYear: days.reduce((sum, d) => sum + d.count, 0) }, contributions: days }
}

export async function GET() {
    const token = process.env.GITHUB_TOKEN

    if (token) {
        try {
            return NextResponse.json(await fetchFromGitHub(token))
        } catch {
            // token 失效或网络异常时回退公开数据源
        }
    }

    try {
        const res = await fetch(FALLBACK, { next: { revalidate: 3600 } })
        if (!res.ok) {
            return NextResponse.json({ error: `HTTP ${res.status}` }, { status: res.status })
        }
        return NextResponse.json(await res.json())
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 502 })
    }
}
