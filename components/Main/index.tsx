export function Main({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="px-7 py-8 of-x-hidden max-md:px-6 max-sm:pt-0">
        {children}
    </main>
}
