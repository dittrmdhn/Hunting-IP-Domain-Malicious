import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
	return (
		<input
			{...props}
			className={`border p-2 rounded w-full ${props.className ?? ""}`}
		/>
	);
}
