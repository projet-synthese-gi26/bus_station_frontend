/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    output: 'standalone',
    async rewrites() {
        const backendUrl = process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL ?? 'https://traefikdev.yowyob.com/bus-station';
        return [
            {
                source: '/trip-agency/:path*',
                destination: `${backendUrl}/:path*`,
            },
        ];
    },
    images: {
        remotePatterns: [
            'bougna.net',
            'st.depositphotos.com',
            'c.wallhere.com',
            'media.istockphoto.com',
            'images.unsplash.com',
        ].map(hostname => ({
            protocol: "https",
            hostname: "encrypted-tbn0.gstatic.com",
        })),
    },
    eslint:{
        ignoreDuringBuilds:true
    }
};

module.exports = nextConfig;