import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <>{children}</>
    </>
  );
}
