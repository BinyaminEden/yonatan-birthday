import Image from "next/image";

export function SlothPilot({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/sloth.png"
      alt="עצלן טייס חילוץ"
      width={800}
      height={600}
      priority={priority}
      className={`w-full h-auto drop-shadow-2xl ${className}`}
    />
  );
}
