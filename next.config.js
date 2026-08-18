/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
      unoptimized: true,
    },
 async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return { beforeFiles: [], afterFiles: [], fallback: [] }
    }

    return {
      beforeFiles: [
        {
          source: '/mail.php',
          destination: 'http://localhost/ecom/mail.php',
        },
        {
          source: '/api/submit.php',
          destination: 'http://localhost/ecom/mail.php',
        },
        {
          source: '/api/mpurse.php',
          destination: 'http://127.0.0.1:8088/mpurse.php',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
};

module.exports = nextConfig;
