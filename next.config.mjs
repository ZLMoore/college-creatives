/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/for-artists", destination: "/artist-portal", permanent: true }];
  },
};

export default nextConfig;
