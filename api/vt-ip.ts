import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Handle CORS preflight
	if (req.method === "OPTIONS") {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		return res.status(200).end();
	}

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { ip, apiKey } = req.body;

	if (!ip || typeof ip !== "string") {
		return res.status(400).json({ error: "IP required" });
	}

	if (!apiKey || typeof apiKey !== "string") {
		return res.status(400).json({ error: "API key required" });
	}

	try {
		const response = await fetch(
			`https://www.virustotal.com/api/v3/ip_addresses/${encodeURIComponent(
				ip
			)}`,
			{
				headers: {
					"x-apikey": apiKey,
					Accept: "application/json",
				},
			}
		);

		const data = await response.json();

		// Set CORS headers for actual response
		res.setHeader("Access-Control-Allow-Origin", "*");
		return res.status(response.status).json(data);
	} catch (err) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		return res.status(500).json({ error: "Failed to fetch" });
	}
}
