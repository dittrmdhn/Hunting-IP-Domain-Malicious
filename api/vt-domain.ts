import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const VT_API_KEY = process.env.VT_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// CORS headers
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}

	const { domain } = req.query;
	if (!domain || typeof domain !== "string") {
		return res.status(400).json({ error: "Domain required" });
	}

	try {
		const response = await fetch(
			`https://www.virustotal.com/api/v3/domains/${domain}`,
			{
				headers: {
					"x-apikey": VT_API_KEY!,
					Accept: "application/json",
				},
			}
		);

		const data = await response.json();
		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch" });
	}
}
