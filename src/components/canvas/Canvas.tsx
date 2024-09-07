import { ComponentProps, FC, useEffect, useRef, useState } from "react";
import { useDataContext } from "../../context/DataContext";
import { useCanvasContext } from "../../context/CanvasContext";

export const Canvas: FC<ComponentProps<"div">> = () => {
	const { headers, sideHeaders, data } = useDataContext();
	const { dimenstions } = useCanvasContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvasCtx = canvasRef.current.getContext("2d");
		if (!canvasCtx) {
			return;
		}

		const height = canvasRef.current.height;
		const width = canvasRef.current.width;
		const yOffset = 16;
		const xOffset = 50;

		const multY = (height - yOffset) / 10;
		const multX = (width - xOffset) / (headers.length);

		const maxVal = Math.floor(
			data.flat().reduce(
				(acc, val) => Math.max(acc, val)
				, 0)
		)

		canvasCtx.font = `${yOffset}px Arial`;
		canvasCtx.fillStyle = "black";
		let yLabelValue = maxVal;
		for (let y = yOffset; y < height - yOffset; y += multY) {
			canvasCtx.fillText(`${yLabelValue}`, xOffset - 40, y);
			yLabelValue = Math.floor(yLabelValue - maxVal / 10);
		}

		for (let i = 0; i < headers.length; i++) {
			canvasCtx.fillText(headers[i], xOffset + i * multX, height);
		}

		const sideLine = new Path2D();
		sideLine.moveTo(xOffset, 0);
		sideLine.lineTo(xOffset, height - yOffset);

		const bottomLine = new Path2D();
		bottomLine.moveTo(xOffset, height - yOffset);
		bottomLine.lineTo(width, height - yOffset);

		canvasCtx.strokeStyle = "black";
		canvasCtx.stroke(sideLine);
		canvasCtx.stroke(bottomLine);

		for (let i = 0; i < data[0].length; i++) {
			const line = new Path2D();
			line.moveTo(
				xOffset,
				height - yOffset - (data[0][i] / maxVal) * (height - yOffset)
			);
			for (let j = 1; j < data.length; j++) {
				line.lineTo(
					xOffset + j * multX,
					height - yOffset - (data[j][i] / maxVal) * (height - yOffset)
				);
			}
			canvasCtx.strokeStyle = `hsl(${(i * 360 / data.length)}, 100%, 50%)`;
			canvasCtx.stroke(line);
		}

		return () => canvasCtx.clearRect(0, 0, width, height);
	}, [canvasRef, data, headers, dimenstions.height, dimenstions.width]);

	return (<div>
		<canvas width={dimenstions.width} height={dimenstions.height}
			ref={canvasRef}
		>
		</canvas>
	</div>
	)
}
