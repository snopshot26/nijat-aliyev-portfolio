import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nijat Aliyev portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(99,102,241,0.40), transparent 35%), radial-gradient(circle at 75% 20%, rgba(56,189,248,0.25), transparent 25%), linear-gradient(160deg, #050816 0%, #0b1022 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 24,
              color: "rgba(179, 208, 255, 0.95)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
              }}
            >
              NA
            </div>
            Nijat Aliyev
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 700, maxWidth: 900 }}>
              Building reliable software and solving real-world problems.
            </div>
            <div style={{ fontSize: 28, color: "rgba(226,232,240,0.8)", maxWidth: 760 }}>
              Full-Stack Developer | Software Engineer
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
