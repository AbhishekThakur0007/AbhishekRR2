"use client"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

export function RevaLogo() {
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  return (
    <Link href="/" className="flex items-center">
      {isDarkTheme ? (
        <Image src="/reVA.svg" alt="REVA" width={141} height={27} className="h-5 w-auto" priority />
      ) : (
        <Image src="/REVA - dark.svg" alt="REVA" width={160} height={31} className="h-5 w-auto" priority />
      )}
    </Link>
  )
}

