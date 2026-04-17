const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserPage = repoName.endsWith('.github.io');
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const basePath = configuredBasePath || (process.env.GITHUB_ACTIONS && !isUserPage ? `/${repoName}` : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
