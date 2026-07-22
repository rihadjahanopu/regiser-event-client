import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.API_URL || "http://127.0.0.1:5000"}/api/:path*`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**", // Cloudinary-এর যেকোনো ফোল্ডার বা পাথ অ্যালাউ করার জন্য
			},
		],
	},
};

export default nextConfig;
