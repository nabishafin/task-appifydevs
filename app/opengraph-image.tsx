import { ImageResponse } from "next/og";
import { MODELS } from "@/data/models";

export const alt = "EchoGPT — every leading AI model in one calm workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const providers = Array.from(new Set(MODELS.map((model) => model.name.split(" ")[0]))).slice(0, 6);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#09090B",
        color: "#F8FAFC",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#6D5DFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          E
        </div>
        <div style={{ fontSize: 34, fontWeight: 600 }}>EchoGPT</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
          Every leading AI model. One calm workspace.
        </div>
        <div style={{ fontSize: 28, color: "#A1A1AA" }}>Web app · Chrome sidebar · Prompt library · Model compare</div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {providers.map((name) => (
          <div
            key={name}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid #272B35",
              background: "#151821",
              fontSize: 22,
              color: "#F8FAFC",
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
