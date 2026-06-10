import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Note: rewrites don't work in static export (npm run build:dist)
  // The frontend calls the API directly using NEXT_PUBLIC_API_URL
};

export default withContentlayer(nextConfig);
