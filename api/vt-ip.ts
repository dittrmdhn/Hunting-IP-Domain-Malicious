import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

const VT_API_KEY = process.env.VT_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { ip } = req.query;
	if (!ip || typeof ip !== "string") {
		return res.status(400).json({ error: "IP required" });
	}

	try {
		const response = await fetch(
			`https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
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
