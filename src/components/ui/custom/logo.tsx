"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 120, height = 40 }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo.png"

  return (
    <Link href="/" className={className}>
      <Image
        src={logoSrc || "/placeholder.svg"}
        alt="Event Leads Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </Link>
  )
}
