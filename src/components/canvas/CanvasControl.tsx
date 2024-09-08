import { ComponentProps, FC } from "react";
import { useCanvasContext } from "../../context/CanvasContext";

export const CanvasControl: FC<ComponentProps<"div">> = () => {
	const { dimenstions, setDimenstions } = useCanvasContext()

	return (
		<div className="fixed right-0 top-0">
			<input type="range" value={dimenstions.height}
				onChange={e => setDimenstions(prev => ({
					...prev,
					height: Number(e.target.value)
				}))}
				max={1100} />
			<input type="range" value={dimenstions.width}
				onChange={e => setDimenstions(prev => ({
					...prev,
					width: Number(e.target.value)
				}))}
				max={1100} />
		</div>
	)
}
