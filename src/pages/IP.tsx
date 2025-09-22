import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Input from "../components/Input";
import Button from "../components/Button";
import ResultItem from "../components/ResultItem";

type Output = {
	ip: string;
	result: string;
};

export default function IP() {
	const [apiKey, setApiKey] = useLocalStorage("vt_api_key", "");
	const [bulk, setBulk] = useState<string>(""); // textarea content
	const [processing, setProcessing] = useState(false);
	const [results, setResults] = useState<Output[]>([]);
	const [progressIndex, setProgressIndex] = useState(0);
	const [selected, setSelected] = useState<string | null>(null);

	function handleSelect(item: string) {
		setSelected((prev) => (prev === item ? null : item));
	}

	// sanitize single ip string
	const sanitize = (s: string) =>
		s
			.trim()
			.replace(/^["']+|["']+$/g, "") // remove surrounding quotes
			.replace(/^https?:\/\//i, "") // remove protocol
			.replace(/\/+$/g, "") // remove trailing slash(es)
			.trim();

	// delay helper
	const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

	// main handler (sequential)
	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!apiKey?.trim()) {
			alert("Masukkan API key VirusTotal terlebih dahulu.");
			return;
		}

		const lines = bulk
			.split(/\r?\n/)
			.map((l) => sanitize(l))
			.filter((l) => l.length > 0);

		if (lines.length === 0) {
			alert("Masukkan minimal satu ip (1 per baris).");
			return;
		}

		setResults([]);
		setProcessing(true);
		setProgressIndex(0);

		for (let i = 0; i < lines.length; i++) {
			const ip = lines[i];
			setProgressIndex(i + 1);

			// Fetch and interpret VT response
			try {
				const resp = await fetch(
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

				// friendly handling based on status codes
				if (resp.status === 400) {
					pushResult({ ip, result: "invalid ip" });
				} else if (resp.status === 404) {
					pushResult({ ip, result: "unknown / not found" });
				} else if (!resp.ok) {
					pushResult({ ip, result: `error ${resp.status}` });
				} else {
					const data = await resp.json();
					const stats = data?.data?.attributes?.last_analysis_stats ?? {};
					const malicious = Number(stats.malicious ?? 0);
					const suspicious = Number(stats.suspicious ?? 0);

					if (malicious > 0) {
						pushResult({ ip, result: `${malicious} malicious` });
					} else if (suspicious > 0) {
						pushResult({ ip, result: `${suspicious} suspicious` });
					} else {
						// show "clean" in requested format: "<clean> Clean – <suspicious> Suspicious"
						// but per your last request show "clean - N suspicious" (we'll show "X Clean - Y Suspicious")
						pushResult({
							ip,
							result: `Clean - ${suspicious} Suspicious`,
						});
					}
				}
			} catch (err) {
				pushResult({ ip, result: "failed to fetch" });
			}

			// small delay to make sequence visible/animated (adjustable)
			await wait(350);
		}

		setProcessing(false);
		setProgressIndex(0);
	};

	// push result to visible list (will render with animation in ResultItem)
	function pushResult(o: Output) {
		setResults((prev) => [...prev, o]);
	}

	return (
		<div className="max-w-3xl mx-auto mt-10 px-4">
			<h1 className="text-2xl font-bold mb-4">IP Addresses Hunting</h1>

			<p className="block mb-2 font-medium text-vt">VirusTotal API Key</p>
			<Input
				value={apiKey}
				onChange={(e) => setApiKey(e.target.value)}
				placeholder="Masukkan API Key"
				type="password"
			/>

			<p className="block mt-4 mb-2 font-medium text-rows">
				List IP (1 per rows)
			</p>
			<textarea
				value={bulk}
				onChange={(e) => setBulk(e.target.value)}
				rows={10}
				className="border rounded p-2 w-full font-mono"
				placeholder={`"23.128.248.10"\n"23.128.248.10
150.171.22.17\n"83.168.69.133"\n"94.154.159.96\n"209.59.168.216"\n"185.247.224.52"`}
			/>

			<div className="flex items-center gap-3 mt-4 bottom">
				<Button onClick={handleSubmit} disabled={processing}>
					{processing ? "Processing..." : "Submit"}
				</Button>
				<Button
					onClick={() => {
						setBulk("");
						setResults([]);
					}}
					disabled={processing}
				>
					Clear
				</Button>

				<div
					className="text-process"
					style={{ marginLeft: "auto", color: "#444", fontSize: 14 }}
				>
					{processing ? (
						<span>
							Processing... {progressIndex} /{" "}
							{bulk.split(/\r?\n/).filter(Boolean).length}
						</span>
					) : (
						""
					)}
				</div>
			</div>

			<div className="mt-6">
				{results.map((r, idx) => (
					<ResultItem
						key={idx}
						item={r.ip}
						result={r.result}
						delay={idx * 80}
						onClick={handleSelect}
						isSelected={selected === r.ip}
						type="ip"
					/>
				))}
			</div>
		</div>
	);
}
