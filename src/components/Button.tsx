import React from "react";

type props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: props) {
	return (
		<button
			{...props}
			className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 ${
				props.className ?? ""
			}`}
		>
			{children}
		</button>
	);
}
