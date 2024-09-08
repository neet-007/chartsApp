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
		const yOffset = 100;
		const xOffset = 50;
		const fontSize = 16;

		const multY = (height - 2 * yOffset) / 10;
		const multX = (width - 2 * xOffset) / (headers.length);

		const maxVal = Math.floor(
			data.flat().reduce(
				(acc, val) => Math.max(acc, val),
				0
			)
		);

		canvasCtx.clearRect(0, 0, width, height);

		canvasCtx.font = `${fontSize}px Arial`;
		canvasCtx.fillStyle = "black";
		let yLabelValue = maxVal;
		for (let y = yOffset; y <= height - yOffset; y += multY) {
			canvasCtx.fillText(`${yLabelValue}`, xOffset - 40, y + (fontSize / 2));
			yLabelValue = Math.floor(yLabelValue - maxVal / 10);
		}

		for (let i = 0; i < headers.length; i++) {
			canvasCtx.fillText(headers[i], xOffset + i * multX, height - yOffset + 20);
		}

		const sideLine = new Path2D();
		sideLine.moveTo(xOffset, yOffset);
		sideLine.lineTo(xOffset, height - yOffset);

		const bottomLine = new Path2D();
		bottomLine.moveTo(xOffset, height - yOffset);
		bottomLine.lineTo(width - xOffset, height - yOffset);

		canvasCtx.strokeStyle = "black";
		canvasCtx.stroke(sideLine);
		canvasCtx.stroke(bottomLine);

		for (let i = 0; i < data.length; i++) {
			const line = new Path2D();
			line.moveTo(
				xOffset,
				yOffset + (1 - data[i][0] / maxVal) * (height - 2 * yOffset)
			);
			for (let j = 1; j < data[i].length; j++) {
				line.lineTo(
					xOffset + j * multX,
					yOffset + (1 - data[i][j] / maxVal) * (height - 2 * yOffset)
				);
			}
			canvasCtx.strokeStyle = sideHeaders[i].color;
			canvasCtx.lineWidth = 2;
			canvasCtx.lineJoin = "round";
			canvasCtx.shadowColor = "rgba(0, 0, 0, 0.2)";
			canvasCtx.shadowBlur = 4;
			canvasCtx.shadowOffsetX = 2;
			canvasCtx.shadowOffsetY = 2;
			canvasCtx.stroke(line);
		}

		canvasCtx.strokeStyle = "#000000";
		canvasCtx.lineWidth = 1;
		canvasCtx.lineJoin = "miter";
		canvasCtx.shadowColor = "rgba(0, 0, 0, 0)";
		canvasCtx.shadowBlur = 0;
		canvasCtx.shadowOffsetX = 0;
		canvasCtx.shadowOffsetY = 0;


		const legendMultX = (width - 2 * xOffset) / (sideHeaders.length);
		for (let i = 0; i < sideHeaders.length; i++) {
			canvasCtx.fillStyle = sideHeaders[i].color;
			canvasCtx.fillRect(xOffset + i * legendMultX, height - 20, 10, 10);

			canvasCtx.fillStyle = "#000000";
			canvasCtx.fillText(sideHeaders[i].header, xOffset + 14 + i * legendMultX, height - 10);
		}

		return () => {
			canvasCtx.clearRect(0, 0, width, height);
			canvasCtx.strokeStyle = "#000000";
			canvasCtx.lineWidth = 1;
			canvasCtx.lineJoin = "miter";
			canvasCtx.shadowColor = "rgba(0, 0, 0, 0)";
			canvasCtx.shadowBlur = 0;
			canvasCtx.shadowOffsetX = 0;
			canvasCtx.shadowOffsetY = 0;
		}
	}, [canvasRef, data, headers, dimenstions.height, dimenstions.width]);

	return (<div>
		<canvas width={dimenstions.width} height={dimenstions.height}
			ref={canvasRef}
		>
		</canvas>
	</div>
	)
}
