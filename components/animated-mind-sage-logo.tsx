interface MindSageLogoProps {
  size?: number
  variant?: "color" | "mono" | "light"
}

export function MindSageLogo({ size = 100, variant = "color" }: MindSageLogoProps) {
  const isCompact = size < 48
  const isMedium = size >= 48 && size < 72

  const getColors = () => {
    switch (variant) {
      case "mono":
        return {
          outerStroke: "#64748b",
          outerFill: "none",
          coreFill: "#334155",
          coreStroke: "#475569",
          diamondFill: "#1e293b",
          flowStroke: "#64748b",
        }
      case "light":
        return {
          outerStroke: "rgba(255, 255, 255, 0.25)",
          outerFill: "none",
          coreFill: "rgba(255, 255, 255, 0.9)",
          coreStroke: "rgba(255, 255, 255, 0.95)",
          diamondFill: "rgba(255, 255, 255, 1)",
          flowStroke: "rgba(255, 255, 255, 0.4)",
        }
      default:
        return {
          outerStroke: "url(#outerGradient)",
          outerFill: "url(#subtleFill)",
          coreFill: "url(#coreGradient)",
          coreStroke: "url(#coreStroke)",
          diamondFill: "url(#diamondGradient)",
          flowStroke: "url(#flowGradient)",
        }
    }
  }

  const colors = getColors()
  const strokeWidth = size * 0.015

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b9dc3" />
          <stop offset="100%" stopColor="#9fa8cf" />
        </linearGradient>

        <linearGradient id="subtleFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dce4f0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d5dff0" stopOpacity="0.04" />
        </linearGradient>

        <linearGradient id="coreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a91b3" />
          <stop offset="50%" stopColor="#6f7f9c" />
          <stop offset="100%" stopColor="#5d6d8a" />
        </linearGradient>

        <linearGradient id="coreStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a9fc5" />
          <stop offset="100%" stopColor="#7088a8" />
        </linearGradient>

        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6d85a8" />
          <stop offset="100%" stopColor="#596d8c" />
        </linearGradient>

        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a9fb5" />
          <stop offset="100%" stopColor="#88afc6" />
        </linearGradient>
      </defs>

      {/* Outer boundary */}
      <path
        d="M 50 10 
           C 63 10, 74 14, 82 22
           C 90 30, 94 40, 94 50
           C 94 60, 90 70, 82 78
           C 74 86, 63 90, 50 90
           C 37 90, 26 86, 18 78
           C 10 70, 6 60, 6 50
           C 6 40, 10 30, 18 22
           C 26 14, 37 10, 50 10 Z"
        stroke={colors.outerStroke}
        strokeWidth={strokeWidth}
        fill={colors.outerFill}
        opacity="0.6"
      />

      {/* Inner containment layer */}
      {!isCompact && (
        <path
          d="M 50 16
             C 60 16, 69 19, 75 26
             C 81 33, 85 41, 85 50
             C 85 59, 81 67, 75 74
             C 69 81, 60 84, 50 84
             C 40 84, 31 81, 25 74
             C 19 67, 15 59, 15 50
             C 15 41, 19 33, 25 26
             C 31 19, 40 16, 50 16 Z"
          stroke={colors.outerStroke}
          strokeWidth={strokeWidth * 0.6}
          fill="none"
          opacity="0.25"
        />
      )}

      {/* Flow elements */}
      {!isCompact && !isMedium && (
        <>
          <path
            d="M 28 44 Q 34 38, 42 36 Q 46 35, 48 36"
            stroke={colors.flowStroke}
            strokeWidth={strokeWidth * 1.4}
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />

          <path
            d="M 72 58 Q 66 62, 60 64"
            stroke={colors.flowStroke}
            strokeWidth={strokeWidth * 1.1}
            fill="none"
            strokeLinecap="round"
            opacity="0.25"
          />
        </>
      )}

      {/* Vertical core */}
      <rect
        x="44"
        y="28"
        width="12"
        height="44"
        rx="6"
        fill={colors.coreFill}
        stroke={colors.coreStroke}
        strokeWidth={strokeWidth * 0.5}
        opacity="0.95"
      />

      {/* Core highlight */}
      {!isCompact && <rect x="46" y="30" width="8" height="40" rx="4" fill="url(#coreStroke)" opacity="0.12" />}

      {/* Diamond anchor */}
      <path d="M 50 46 L 52.7 50 L 50 54 L 47.3 50 Z" fill={colors.diamondFill} opacity="0.85" />

      {/* Diamond facet */}
      {!isCompact && <path d="M 50 48 L 51.2 50 L 50 52 L 48.8 50 Z" fill={colors.outerStroke} opacity="0.18" />}

      {/* Anchor extension */}
      {!isCompact && (
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="64"
          stroke={colors.coreStroke}
          strokeWidth={strokeWidth * 0.6}
          opacity="0.22"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
