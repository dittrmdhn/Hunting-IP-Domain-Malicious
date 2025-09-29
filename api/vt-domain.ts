import type { VercelRequest, VercelResponse } from "@vercel/node";
const apiKeys = [
	process.env.VT_API_KEY_1,
	process.env.VT_API_KEY_2,
	process.env.VT_API_KEY_3,
].filter(Boolean) as string[];
let currentKeyIndex = 0;
/** * Ambil API key secara bergantian (round robin) */ function getApiKey(): string {
	if (apiKeys.length === 0) {
		throw new Error("Tidak ada API key VirusTotal yang tersedia");
	}
	const key = apiKeys[currentKeyIndex];
	currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
	return key;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	try {
		const { domain } = req.body;
		if (!domain || typeof domain !== "string") {
			return res.status(400).json({ error: "Domain harus diisi" });
		}
		const apiKey = getApiKey();
		const url = `https://www.virustotal.com/api/v3/domains/${domain}`;
		const vtResponse = await fetch(url, {
			headers: { accept: "application/json", "x-apikey": apiKey },
		});
		if (!vtResponse.ok) {
			const text = await vtResponse.text();
			return res
				.status(vtResponse.status)
				.json({ error: "Gagal mengambil data dari VirusTotal", details: text });
		}
		const data = await vtResponse.json();
		return res.status(200).json(data);
	} catch (err: any) {
		return res
			.status(500)
			.json({ error: "Internal server error", details: err.message });
	}
}
