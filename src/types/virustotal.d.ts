// src/types/virustotal.d.ts
export type LastAnalysisStats = {
	harmless?: number;
	malicious?: number;
	suspicious?: number;
	undetected?: number;
	timeout?: number;
};

export type VirusTotalResponse = {
	stats?: LastAnalysisStats | null;
	// optional raw error message
	error?: string;
};
