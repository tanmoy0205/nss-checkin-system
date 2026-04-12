import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const alt = "NSS Logo";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default async function Icon() {
  try {
    const iconPath = join(process.cwd(), "public", "nss.png");
    const iconData = await readFile(iconPath);
    const iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconBase64}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Icon generation error:", error);
    // Fallback if nss.png is missing or can't be read
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: "#003366",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            borderRadius: "50%",
          }}
        >
          N
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
