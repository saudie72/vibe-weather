import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, STEP_NAMES } from "./theme";

type Props = {
  readonly title: string;
  readonly source: string;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const OutroSceneInner: React.FC<Props> = ({ title, source }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        fontFamily: FONT,
        color: COLORS.text,
        padding: "130px 160px",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 60,
          rowGap: 34,
        }}
      >
        {STEP_NAMES.map((name, index) => {
          const start = (0.5 + index * 0.3) * fps;
          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
                fontSize: 46,
                fontWeight: 600,
                whiteSpace: "nowrap",
                opacity: interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: ease,
                }),
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  flexShrink: 0,
                  background: COLORS.done,
                  color: COLORS.background,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 800,
                  scale: interpolate(frame, [start, start + 0.4 * fps], [0.4, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.spring({ damping: 12 }),
                    output: "perceptual-scale",
                  }),
                }}
              >
                ✓
              </div>
              <span style={{ color: COLORS.muted, marginRight: -12 }}>{index + 1}.</span>
              {name}
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 30, color: "#5d6a80" }}>{source}</div>
    </AbsoluteFill>
  );
};

export const OutroScene = Interactive.create({
  Component: OutroSceneInner,
  layout: "absolute-fill",
});
