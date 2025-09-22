import Domain from "./pages/Domain";
import Ip from "./pages/IP";
import { useState } from "react";

export default function App() {
	const [activeTab, setActiveTab] = useState<"domain" | "ip">("domain");

	return (
		<div className="min-h-screen bg-gray-950 text-green-300 font-mono overflow-x-hidden flex flex-col">
			{/* Header */}
			<header className="bg-black border-b border-green-700 shadow-lg">
				<div className="container mx-auto flex items-center justify-between px-6 py-4">
					<h1 className="title-soc">SOC Hunting</h1>

					<nav className="flex space-x-6">
						<button
							onClick={() => setActiveTab("domain")}
							className={`${
								activeTab === "domain" ? "selected-item" : "text-gray-500"
							} hover:text-green-300 transition`}
						>
							Domain
						</button>
						<button
							onClick={() => setActiveTab("ip")}
							className={`${
								activeTab === "ip" ? "selected-item" : ""
							} hover:text-green-300 transition`}
						>
							IP
						</button>
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 container mx-auto px-6 py-10">
				<div className="bg-gray-900/70 rounded-lg shadow-xl border border-green-800 p-6">
					{activeTab === "domain" ? <Domain /> : <Ip />}
				</div>
			</main>
		</div>
	);
}
