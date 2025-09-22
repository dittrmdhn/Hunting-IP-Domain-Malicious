import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST")
		return res.status(405).json({ error: "Method not allowed" });

	const { ip, apiKey } = req.body;
	if (!ip || !apiKey)
		return res.status(400).json({ error: "IP & API key required" });

	try {
		const response = await fetch(
			`https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
			{
				headers: { "x-apikey": apiKey, Accept: "application/json" },
			}
		);
		const data = await response.json();
		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch" });
	}
}
