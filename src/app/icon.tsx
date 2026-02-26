import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const imgData = await readFile(join(process.cwd(), "public", "tab1.png"));
  const base64 = imgData.toString("base64");
  const src = `data:image/png;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={src} width={32} height={32} style={{ borderRadius: 4 }} />
      </div>
    ),
    { ...size }
  );
}
