import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { LayoutClientWrapper } from '@/components/LayoutClientWrapper'
import { LocaleAwareHtml } from '@/components/LocaleAwareHtml'
import type { Metadata } from 'next'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const messages = (await import(`@/messages/${locale}.json`)).default
  return {
    title: 'Neumann615(Z)',
    description: messages.metadata.description,
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'zh' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LocaleAwareHtml />
      <LayoutClientWrapper>{children}</LayoutClientWrapper>
    </NextIntlClientProvider>
  )
}
