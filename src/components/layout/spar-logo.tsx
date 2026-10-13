import Image from "next/image";
import { cn } from "cn";

interface SparLogoProps {
  className?: string;
}

export function SparLogo({ className }: SparLogoProps) {
  return (
    <Image
      src="/sparlogo.png"
      alt="SPAR"
      width={120}
      height={48}
      priority
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
