import {ThemeSwitch} from "./ThemeSwitch"

function Header() {
    return (
        <div className="fixed top-4 right-6 z-50 select-none">
            <div className="p-2 rounded-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm">
                <ThemeSwitch></ThemeSwitch>
            </div>
        </div>
    )
}

export {Header}

export default Header
