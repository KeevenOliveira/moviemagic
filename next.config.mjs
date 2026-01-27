/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        port: "",
        hostname: "media.themoviedb.org",
        pathname: "/t/p/w220_and_h330_face/**",
        protocol: "https",
      },
      {
        port: "",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w220_and_h330_face/**",
        protocol: "https",
      },
      {
        port: "",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w342/**",
        protocol: "https",
      },
      {
        port: "",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w92/**",
        protocol: "https",
      },
      {
        port: "",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w154/**",
        protocol: "https",
      },
      {
        port: "",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w780/**",
        protocol: "https",
      },
      {
        port: "",
        hostname: "image.tmdb.org",
        pathname: "/t/p/w1280/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
