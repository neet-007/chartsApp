import { ComponentProps, FC, useEffect, useRef, useState } from "react";
import { useDataContext } from "../../context/DataContext";

export const Canvas: FC<ComponentProps<"div">> = () => {
	const { headers, sideHeaders, data } = useDataContext();
	const [dimenstions, setDimenstions] = useState<{ height: number, width: number }>({
		height: 300,
		width: 900,
	})
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) {
			return
		}

		const canvasCtx = canvasRef.current.getContext("2d");
		if (!canvasCtx) {
			return
		}

		let mult = Math.floor(dimenstions.height / 10);
		let curr = 16;

		canvasCtx.font = "16px Arial";
		canvasCtx.fillStyle = "black";

		while (curr < dimenstions.height - 16) {
			canvasCtx.fillText(`${curr}mm`, 0, curr)
			curr += mult;
		}

		mult = Math.floor(dimenstions.width / (headers.length));
		let index = 0;
		curr = 100;

		while (curr <= dimenstions.width) {
			canvasCtx.fillText(`${index}`, curr, dimenstions.height);
			curr += mult;
			index++;
		}

		const sideLine = new Path2D();
		sideLine.moveTo(100, 0);
		sideLine.lineTo(100, canvasRef.current.height - 16);
		const bottomLine = new Path2D();
		bottomLine.moveTo(100, canvasRef.current.height - 16);
		bottomLine.lineTo(canvasRef.current.width, canvasRef.current.height - 16)

		canvasCtx.strokeStyle = "black";
		canvasCtx.stroke(sideLine);
		canvasCtx.stroke(bottomLine);
	}, [dimenstions.height, dimenstions.width])

	return (<div>
		<canvas width={dimenstions.width} height={dimenstions.height}
			ref={canvasRef}
		>
		</canvas>
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
