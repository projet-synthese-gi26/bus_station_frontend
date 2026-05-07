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
            protocol: 'https' as const,
            hostname,
            pathname: '/**',
        })),
    },
    eslint:{
        ignoreDuringBuilds:true
    }
};

module.exports = nextConfig;