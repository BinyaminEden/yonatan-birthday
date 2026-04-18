import Image from "next/image";

export function SlothPilot({
  className = "",
  priority = false,
  cover = false,
}: {
  className?: string;
  priority?: boolean;
  cover?: boolean;
}) {
  if (cover) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src="/sloth.png"
          alt="עצלן טייס חילוץ"
          fill
          priority={priority}
          sizes="(max-width: 640px) 10rem, 13rem"
          className="object-cover drop-shadow-2xl"
        />
      </div>
    );
  }
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
