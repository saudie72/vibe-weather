import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ProgressRail } from "./ProgressRail";
import { COLORS, FONT } from "./theme";

type Props = {
  readonly step: number;
  readonly title: string;
  readonly why: string;
  readonly items: string[];
  readonly chapter: string;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const StepSceneInner: React.FC<Props> = ({ step, title, why, items, chapter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: COLORS.background, fontFamily: FONT, color: COLORS.text }}>
      <ProgressRail current={step} />
      <div
        style={{
          position: "absolute",
          left: 720,
          right: 110,
          top: 150,
          bottom: 130,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 4,
            color: COLORS.accent,
            opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: ease,
            }),
          }}
        >
          STEP {step} OF 8
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.06,
            marginTop: 18,
            opacity: interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: ease,
            }),
            translate: interpolate(frame, [0.3 * fps, 1 * fps], ["0px 40px", "0px 0px"], {
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
            fontSize: 42,
            color: COLORS.muted,
            marginTop: 22,
            lineHeight: 1.3,
            opacity: interpolate(frame, [0.7 * fps, 1.3 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: ease,
            }),
          }}
        >
          {why}
        </div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((item, index) => {
            const start = (1.4 + index * 0.45) * fps;
            return (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  fontSize: 44,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  background: COLORS.panel,
                  borderLeft: `8px solid ${COLORS.accent}`,
                  borderRadius: 12,
                  padding: "18px 30px",
                  opacity: interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: ease,
                  }),
                  translate: interpolate(frame, [start, start + 0.5 * fps], ["60px 0px", "0px 0px"], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: ease,
                  }),
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 30, color: "#5d6a80" }}>PeopleBooks: {chapter}</div>
      </div>
    </AbsoluteFill>
  );
};

export const StepScene = Interactive.create({
  Component: StepSceneInner,
  layout: "absolute-fill",
});
