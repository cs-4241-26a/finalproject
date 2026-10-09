export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-teal-400"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
      Utilicheck
    </span>
  );
}
