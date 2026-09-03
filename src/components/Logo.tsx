export function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const gray = light ? "#e2e8f0" : "#9aa3ad";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Circular gasket / flange icon */}
      <svg
        viewBox="0 0 64 64"
        className="h-10 w-10 flex-shrink-0"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="30" fill="none" stroke="#0e7cc4" strokeWidth="5" />
        <circle cx="32" cy="32" r="17" fill="none" stroke="#0e7cc4" strokeWidth="4" />
        <rect x="24" y="24" width="16" height="16" rx="2" fill="none" stroke="#0e7cc4" strokeWidth="3" />
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x = 32 + Math.cos(a) * 24;
          const y = 32 + Math.sin(a) * 24;
          return <circle key={i} cx={x} cy={y} r="2.6" fill="#0e7cc4" />;
        })}
      </svg>
      <div className="leading-none">
        <div className="flex items-center text-2xl font-extrabold tracking-tight">
          <span style={{ color: gray }}>MS</span>
          <span className="text-brand">N</span>
          <span style={{ color: gray }}>SS</span>
        </div>
        <div className="mt-0.5 text-[8px] font-semibold tracking-[0.12em] text-brand">
          DUCTING / FABRICATION / INSTALLATION
        </div>
      </div>
    </div>
  );
}
