import { ThemeSwitch } from "./ThemeSwitch"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

function Header() {
    return (
        <div className="fixed top-4 right-6 z-50 select-none max-sm:hidden flex items-center gap-2">
            <div className="p-2 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
                <LanguageSwitcher />
            </div>
            <div className="p-2 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
                <ThemeSwitch></ThemeSwitch>
            </div>
        </div>
    )
}

export {Header}

export default Header
