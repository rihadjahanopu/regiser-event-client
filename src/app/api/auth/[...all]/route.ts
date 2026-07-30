/* eslint-disable @typescript-eslint/typedef */
import { NextRequest, NextResponse } from "next/server";

/**
 * Auth Proxy Route Handler
 *
 * WHY THIS EXISTS:
 * When frontend (talamijbd.vercel.app) and backend are on different domains,
 * browsers BLOCK cross-origin cookies due to SameSite=Lax policy.
 *
 * This proxy makes auth requests appear to come from the SAME origin as the frontend.
 * The cookie is set on the frontend domain (talamijbd.vercel.app), so the browser accepts it.
 *
 * Flow:
 *   Browser → /api/auth/[...all] (same origin) → Backend /api/auth/[...all]
 *   Response (with Set-Cookie) ← Next.js proxy ← Backend
 */

const BACKEND_URL = (
	process.env.API_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	"http://localhost:5000"
).replace(/\/$/, "");

async function handler(
	request: NextRequest,
	context: { params: Promise<{ all: string[] }> }
) {
	const { all } = await context.params;
	const path = all.join("/");

	const targetUrl = `${BACKEND_URL}/api/auth/${path}`;

	// Build proxy headers — forward all important headers but set correct host
	const headers = new Headers();
	for (const [key, value] of request.headers.entries()) {
		// Skip headers that would break the proxy
		if (["host", "connection", "transfer-encoding"].includes(key.toLowerCase()))
			continue;
		headers.set(key, value);
	}
	headers.set("x-forwarded-host", request.headers.get("host") || "");
	headers.set("x-forwarded-proto", "https");

	// Forward the request to the backend
	const backendRes = await fetch(targetUrl, {
		method: request.method,
		headers,
		body:
			request.method !== "GET" && request.method !== "HEAD" ?
				request.body
			:	undefined,
		// @ts-expect-error — duplex is a valid fetch option but missing from TS types
		duplex: "half",
		redirect: "manual",
	});

	// Build response — forward all headers including Set-Cookie
	const responseHeaders = new Headers();
	for (const [key, value] of backendRes.headers.entries()) {
		// Forward Set-Cookie and all other response headers
		responseHeaders.append(key, value);
	}

	const body = await backendRes.arrayBuffer();

	return new NextResponse(body, {
		status: backendRes.status,
		statusText: backendRes.statusText,
		headers: responseHeaders,
	});
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
