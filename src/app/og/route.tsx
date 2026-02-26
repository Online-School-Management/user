import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic OG image for link previews.
 * - /og → default branded image ("Tip-Top Education")
 * - /og?title=Web+Design&subtitle=Learn+web+design → course-specific branded image
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get("title") || "Tip-Top Education";
    const subtitle =
      searchParams.get("subtitle") || (searchParams.get("title") ? "" : "Computer Training School");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0f172a",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "24px 48px",
              borderBottom: "3px solid #3366FF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                backgroundColor: "#3366FF",
                borderRadius: 8,
                marginRight: 14,
              }}
            >
              <div
                style={{ fontSize: 24, fontWeight: 900, color: "white", letterSpacing: -1 }}
              >
                TT
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#94a3b8" }}>
              Tip-Top Education
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "40px 48px 48px 48px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 30 ? 44 : 56,
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.2,
                maxWidth: "90%",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 26,
                  color: "#94a3b8",
                  marginTop: 20,
                  maxWidth: "85%",
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              padding: "20px 48px",
              borderTop: "1px solid #1e293b",
            }}
          >
            <div style={{ fontSize: 18, color: "#64748b" }}>
              tiptopeducation.net
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (e) {
    console.error("OG image generation failed:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
