"use client";

import * as React from "react";

export interface SwitchProps {
	id?: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export function Switch({
	id,
	checked = false,
	onCheckedChange,
	disabled = false,
	className = "",
}: SwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			id={id}
			aria-checked={checked}
			disabled={disabled}
			onClick={() => !disabled && onCheckedChange?.(!checked)}
			className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
				checked ? "bg-violet-600" : "bg-slate-700"
			} ${className}`}>
			<span
				className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
					checked ? "translate-x-5" : "translate-x-0"
				}`}
			/>
		</button>
	);
}
