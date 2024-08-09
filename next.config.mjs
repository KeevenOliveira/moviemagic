/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.themoviedb.org"],
    remotePatterns: [
      {
        port: "",
        hostname: "media.themoviedb.org",
        pathname: "/t/p/w220_and_h330_face/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
