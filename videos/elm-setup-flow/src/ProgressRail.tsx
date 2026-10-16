import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, STEP_NAMES } from "./theme";

type Props = {
  readonly current: number;
};

export const ProgressRail: React.FC<Props> = ({ current }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 140,
        bottom: 140,
        width: 520,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 21,
          top: 22,
          bottom: 22,
          width: 4,
          background: COLORS.rail,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 21,
          top: 22,
          width: 4,
          height: `calc((100% - 44px) * ${((current - 1 + grow) / (STEP_NAMES.length - 1)).toFixed(4)})`,
          maxHeight: "calc(100% - 44px)",
          background: COLORS.accent,
        }}
      />
      {STEP_NAMES.map((name, index) => {
        const step = index + 1;
        const isCurrent = step === current;
        const isDone = step < current;
        return (
          <div
            key={name}
            style={{ display: "flex", alignItems: "center", gap: 28, position: "relative" }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                background: isCurrent ? COLORS.accent : isDone ? COLORS.done : COLORS.background,
                border: `4px solid ${isCurrent ? COLORS.accent : isDone ? COLORS.done : COLORS.rail}`,
                color: isCurrent || isDone ? COLORS.background : COLORS.muted,
                scale: isCurrent ? interpolate(grow, [0, 1], [0.6, 1.15], { output: "perceptual-scale" }) : 1,
              }}
            >
              {isDone ? "✓" : step}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? COLORS.text : isDone ? COLORS.muted : "#5d6a80",
              }}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
