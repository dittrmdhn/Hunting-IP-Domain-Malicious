export default function ResultItem({
	item,
	result,
	delay = 0,
	onClick,
	isSelected = false,
	type, // optional: "ip" | "domain"
}: {
	item: string;
	result: string;
	delay?: number;
	onClick?: (item: string) => void;
	isSelected?: boolean;
	type?: "ip" | "domain";
}) {
	const lower = result.toLowerCase();
	let cls = "result-item result-clean";

	const cleanMatch = result.match(/(\d+)\s*Clean/i);
	const suspiciousMatch = result.match(/(\d+)\s*Suspicious/i);

	const cleanCount = cleanMatch ? Number(cleanMatch[1]) : 0;
	const suspiciousCount = suspiciousMatch ? Number(suspiciousMatch[1]) : 0;

	if (lower.includes("malicious")) {
		cls = "result-item result-malicious"; // merah
	} else if (suspiciousCount > 0) {
		cls = "result-item result-suspicious"; // kuning
	} else if (cleanCount > 0) {
		cls = "result-item result-clean"; // hijau
	} else if (
		lower.includes("invalid") ||
		lower.includes("failed") ||
		lower.includes("error")
	) {
		cls = "result-item result-invalid";
	} else if (lower.includes("unknown")) {
		cls = "result-item result-unknown";
	}

	// if selected, append selected class
	const wrapperClass = `${cls} ${isSelected ? "result-selected" : ""}`;

	return (
		<div
			className={wrapperClass}
			style={{ animationDelay: `${delay}ms`, padding: 12, borderRadius: 8 }}
			onClick={() => onClick && onClick(item)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick && onClick(item);
				}
			}}
			aria-pressed={isSelected}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				{type && <div className="result-badge">{type.toUpperCase()}</div>}
				<div style={{ fontFamily: "monospace" }}>{item}</div>
			</div>

			<div style={{ fontWeight: 700 }}>{result}</div>
		</div>
	);
}
