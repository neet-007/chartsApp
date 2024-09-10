import { ComponentProps, FC } from "react";

export const Input: FC<ComponentProps<"div"> & {
	title: string,
	type: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'radio' | 'file' | 'date' | 'url' | 'tel' | 'range',
	min?: number,
	max?: number,
	value?: string | number
}> = ({ title, className, onChange, type, defaultValue, value, min, max, ...props }) => {

	return (
		<div className={`flex gap-2 ${className}`} {...props}>
			<label htmlFor={title}>{title}</label>
			<input name={title} id={title}
				className="border-2 border-black"
				type={type} defaultValue={defaultValue}
				value={value} min={min} max={max}
				onChange={onChange} />
		</div>
	)
}
