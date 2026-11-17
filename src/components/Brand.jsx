export default function Brand({ compact = false }) {
  return (
    <a
      href="#inicio"
      aria-label="HardFit Club, início"
      className="flex shrink-0 items-center gap-3 text-cream"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 52 44"
        className="h-10 w-12 fill-current"
      >
        <path d="M4 9 0 12v20l4 3zm7-5L6 7v30l5 3zm7-4-5 2v40l5 2V25h16v19l5-2V2l-5-2v19H18zm23 4v36l5-3V7zm7 5v26l4-3V12z" />
      </svg>
      {!compact && (
        <span className="flex flex-col">
          <span className="text-[23px] font-bold leading-none tracking-[-0.05em]">
            HardFit<span className="font-semibold"> Club</span>
          </span>
          <span className="mt-1.5 hidden text-[8px] tracking-[0.34em] uppercase text-lime/80 min-[400px]:block">
            Conhecimento que transforma
          </span>
        </span>
      )}
    </a>
  )
}
