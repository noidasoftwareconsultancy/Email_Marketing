export function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg', showText?: boolean }) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', subtext: 'text-[8px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', subtext: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', subtext: 'text-xs' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center space-x-3">
      {/* <div className={`${s.icon} bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg`}>
        <span className="text-white font-bold" style={{ fontSize: size === 'sm' ? '16px' : size === 'md' ? '18px' : '24px' }}>
          eYantrik
        </span>
      </div> */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${s.text} font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-none`}>
            eYantrik
          </span>
          <span className={`${s.subtext} text-gray-500 font-medium tracking-wide`}>
            MAIL
          </span>
        </div>
      )}
    </div>
  );
}
