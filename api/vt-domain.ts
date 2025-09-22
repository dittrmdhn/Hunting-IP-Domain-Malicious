import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { domain, apiKey } = req.body;

	if (!domain || typeof domain !== "string") {
		return res.status(400).json({ error: "Domain required" });
	}

	if (!apiKey || typeof apiKey !== "string") {
		return res.status(400).json({ error: "API key required" });
	}

	try {
		const response = await fetch(
			`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`,
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
