import { ImageResponse } from "next/og";

export const alt = "발달나침반 - 연구 기반 아동 발달 가이드 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 50%, #eff6ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🧭</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 16,
          }}
        >
          발달나침반
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          연구 논문 기반의 아동 발달 정보를
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          쉽고 정확하게 전달합니다
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {[
            { icon: "🧩", label: "자폐" },
            { icon: "⚡", label: "ADHD" },
            { icon: "💬", label: "언어" },
            { icon: "🤝", label: "사회성" },
            { icon: "🎨", label: "감각" },
            { icon: "📊", label: "발달" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: 12,
                padding: "12px 20px",
                border: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
