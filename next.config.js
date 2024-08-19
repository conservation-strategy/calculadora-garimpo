/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

const withOffline = require('next-offline')

const config = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  }
}

const nextConfig = withPWA(withOffline(config))

module.exports = nextConfig
