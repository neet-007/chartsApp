import { ComponentProps, FC } from "react";
import { createPortal } from "react-dom";

export const Button: FC<ComponentProps<"button"> & { isPortal?: boolean }> = ({ className, isPortal, children, ...props }) => {

	return (!isPortal ?
		<button className={`p-2 border-1 border-black rounded-full bg-blue-400 text-white ${className}`} {...props}>
			{children}
		</button>
		:
		createPortal(
			<button className={`p-2 border-1 border-black rounded-full bg-blue-400 text-white ${className}`} {...props}>
				{children}
			</button>,
			document.getElementById("download-button")!
		)
	)
}
