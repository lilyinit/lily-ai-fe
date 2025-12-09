// next.config.ts

import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // 1. Set output to 'export' to generate all pages as static HTML files. (Mandatory for GitHub Pages)
  output: "export",

  // 2. Set the base path to the repository name.
  // This is required because GitHub Pages hosts the site in a subdirectory (e.g., https://lilyinit.github.io/lily-ai-fe/).
  basePath: "/lily-ai-fe", // ⚠️ Ensure this matches your repository name!

  // 3. Inject the Backend API URL into the build process.
  // This makes the environment variable available during the static build.
  env: {
    // Type assertion is needed for TypeScript compatibility.
    NEXT_PUBLIC_BACKEND_API_URL: process.env
      .NEXT_PUBLIC_BACKEND_API_URL as string,
  },

  // 4. Optional: If your project has TypeScript errors, you can ignore them during the build.
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
