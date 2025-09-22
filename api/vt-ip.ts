import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
		return res.status(response.status).json(data);
	} catch (err) {
		return res.status(500).json({ error: "Failed to fetch" });
	}
}
