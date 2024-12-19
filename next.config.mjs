/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/image/**',
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: '',
                pathname: '/vi/**',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-ak.spotifycdn.com',
                port: '',
                pathname: '/vi/**',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-ak.spotifycdn.com',
                port: '',
                pathname: '/image/**',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-fa.spotifycdn.com',
                port: '',
                pathname: '/image/**',
            },
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
