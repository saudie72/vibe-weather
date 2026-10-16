import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "./theme";

type Props = {
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const TitleSceneInner: React.FC<Props> = ({ kicker, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        fontFamily: FONT,
        color: COLORS.text,
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: 6,
          color: COLORS.accent,
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontSize: 150,
          fontWeight: 800,
          lineHeight: 1,
          marginTop: 24,
          opacity: interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
          translate: interpolate(frame, [0.2 * fps, 0.9 * fps], ["0px 50px", "0px 0px"], {
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
          height: 8,
          width: 260,
          background: COLORS.accent,
          marginTop: 48,
          scale: interpolate(frame, [0.6 * fps, 1.3 * fps], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          fontSize: 56,
          color: COLORS.muted,
          marginTop: 48,
          opacity: interpolate(frame, [0.9 * fps, 1.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

export const TitleScene = Interactive.create({
  Component: TitleSceneInner,
  layout: "absolute-fill",
});
