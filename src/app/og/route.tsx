import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Dynamic default OG image for link previews (Telegram, Facebook, Viber, etc.).
 * Served at /og so og:image always has a valid URL without needing a static file.
 */
export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            padding: 40,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            Tip-Top Education
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Learn, grow, and achieve with quality education.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG image generation failed:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
