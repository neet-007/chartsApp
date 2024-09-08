import { ComponentProps, FC } from "react";
import { useCanvasContext } from "../../context/CanvasContext";

export const CanvasControl: FC<ComponentProps<"div">> = () => {
	const { dimenstions, setDimenstions,
		title, subTitle, setTitle, setSubTitle } = useCanvasContext()

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
			<div className="flex gap-2">
				<label htmlFor="titleInput">set title</label>
				<input name="titleInput" id="titleInput"
					className="border-2 border-black"
					type="text" defaultValue={title}
					onChange={e => setTitle(e.target.value)} />
			</div>
			<div className="flex gap-2">
				<label htmlFor="subTitleInput">set sub title</label>
				<input name="subTitleInput" id="subTitleInput"
					className="border-2 border-black"
					type="text" defaultValue={subTitle}
					onChange={e => setSubTitle(e.target.value)} />
			</div>
		</div>
	)
}
