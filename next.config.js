/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return { beforeFiles: [], afterFiles: [], fallback: [] };
    }

    return {
      beforeFiles: [
        {
          source: "/api/submit.php",
          destination: "http://localhost/ecom/mail.php",
        },
        {
          source: "/api/mpurse.php",
          destination: "http://localhost/ecom/mpurse.php",
        },
        {
          source: "/api/mpurse-webhook.php",
          destination: "http://localhost/ecom/mpurse-webhook.php",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
