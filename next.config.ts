/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
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