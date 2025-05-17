'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export function RevaLogo() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  return (
    <Link href="/" className="flex items-center">
      {isDarkTheme ? (
        <Image
          src="/images/reva-logo.svg"
          alt="REVA"
          width={141}
          height={27}
          className="w-auto h-5"
          priority
        />
      ) : (
        <Image
          src="/images/reva-logo-dark.svg"
          alt="REVA"
          width={160}
          height={31}
          className="w-auto h-5"
          priority
        />
      )}
    </Link>
  );
}
