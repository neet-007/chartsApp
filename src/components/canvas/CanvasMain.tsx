import { ComponentProps, FC } from "react";
import { Canvas } from "./Canvas";
import { CanvasControl } from "./CanvasControl";

export const CanvasMain: FC<ComponentProps<"div">> = () => {

	return (
		<div className="flex gap-2">
			<Canvas />
			<CanvasControl />
		</div>
	)
}
