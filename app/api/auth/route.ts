import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKITIO || process.env.PUBLIC_KEY || '',
  privateKey: process.env.NEXT_PRIVATE_IMAGEKITIO || process.env.PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT || process.env.NEXT_URL_ENDPOINT_IMAGEKITIO || ''
});

export async function GET() {
  try {
    // Validate configuration
    if (!imagekit.options.publicKey || !imagekit.options.privateKey || !imagekit.options.urlEndpoint) {
      throw new Error("ImageKit configuration is incomplete");
    }

    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("Error in ImageKit authentication:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}