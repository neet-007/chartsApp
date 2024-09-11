import { ComponentProps, FC, useEffect, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import { useCanvasContext } from "../../context/CanvasContext";
import { useSetTitles } from "../../hooks/SetTitles";
import { generateSteps } from "../../utils/generateSteps";
import { Button } from "../shared/Button";
import { canvasDownload } from "../../utils/canvasDownload";

export const VBarChart: FC<ComponentProps<"div">> = () => {
	const { headers, sideHeaders, data, minMaxHeap } = useDataContext();
	const { dimenstions, title, subTitle, canvasBg, showDataInChart } = useCanvasContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useSetTitles(canvasRef, title, subTitle);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvasCtx = canvasRef.current.getContext("2d", { willReadFrequently: true });
		if (!canvasCtx) {
			return;
		}

		let height = canvasRef.current.height;
		const width = canvasRef.current.width;
		const yOffset = 100;
		const xOffset = 50;
		const fontSize = 16;

		const maxVal = Math.floor(
			data.flat().reduce(
				(acc, val) => Math.max(acc, val),
				0
			)
		);

		const minVal = Math.floor(
			data.flat().reduce(
				(acc, val) => Math.min(acc, val),
				data[0][0]
			)
		);

		const numberOfSteps = generateSteps(minVal, maxVal, 20)
		const multY = (height - 2 * yOffset) / ((maxVal - minVal) / numberOfSteps);
		const multX = (width - 2 * xOffset) / (headers.length);


		canvasCtx.font = `${fontSize * 1.5}px Arial`;
		canvasCtx.fillStyle = "black";

		canvasCtx.fillText(title, (width / 2) -
			(canvasCtx.measureText(title).width / 2), fontSize * 1.5);
		canvasCtx.font = `${fontSize * 1.2}px Arial`;
		canvasCtx.fillText(subTitle, (width / 2) -
			(canvasCtx.measureText(subTitle).width / 2), (fontSize * 1.2) +
			(fontSize * 1.5) + 5);

		canvasCtx.font = `${fontSize}px Arial`;
		canvasCtx.fillStyle = "black";
		let yLabelValue = maxVal;
		for (let y = yOffset; y <= height - yOffset; y += multY) {
			if (yLabelValue === 0) {
				yLabelValue = Math.floor(yLabelValue - numberOfSteps);
				continue
			}
			const metrics = canvasCtx.measureText(`${yLabelValue}`);
			const textHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
			canvasCtx.fillText(`${yLabelValue}`, xOffset - 20, y +
				(textHeight / 2));
			yLabelValue = Math.floor(yLabelValue - numberOfSteps);
		}

		const headersOffset: number[] = Array.from({ length: headers.length })
		for (let i = 0; i < headers.length; i++) {
			headersOffset[i] = xOffset + i * multX;
			if (i === 0) {
				canvasCtx.fillText(headers[i].header,
					xOffset + i * multX,
					height - yOffset + 20);
				continue
			}
			headersOffset[i] = xOffset + i * multX - canvasCtx.measureText(headers[i].header).width / 2;
			canvasCtx.fillText(headers[i].header,
				xOffset + i * multX - canvasCtx.measureText(headers[i].header).width / 2,
				height - yOffset + 20);
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

		canvasCtx.font = `${fontSize}px Arial`;

		canvasCtx.fillStyle = "black";
		canvasCtx.globalCompositeOperation = 'destination-over';
		const barWidth = 5;
		const barSpacing = barWidth / 2;

		canvasCtx.globalCompositeOperation = 'source-over';
		canvasCtx.lineWidth = 2;
		canvasCtx.lineJoin = "round";
		canvasCtx.shadowColor = "rgba(0, 0, 0, 0.2)";
		canvasCtx.shadowBlur = 4;
		canvasCtx.shadowOffsetX = 2;
		canvasCtx.shadowOffsetY = 2;
		canvasCtx.font = `${fontSize * 0.75}px Arial`;

		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].length; j++) {
				canvasCtx.strokeStyle = sideHeaders[i].color;
				canvasCtx.fillStyle = sideHeaders[i].color;
				const rect_ = new Path2D();
				const x = headersOffset[j] + i * (barWidth + barSpacing);

				const barHeight = (data[i][j] / maxVal) * (height - 2 * yOffset);

				const y = height - yOffset - barHeight;

				rect_.rect(x, y, barWidth, barHeight);
				canvasCtx.fill(rect_);
				canvasCtx.strokeStyle = "black";
				canvasCtx.fillStyle = "black";
				const metrics = canvasCtx.measureText(`${data[i][j]}`);
				const textHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
				if (showDataInChart) {
					if (j === 0) {
						canvasCtx.fillText(`${data[i][j]}`, x, y - (textHeight / 2));
					} else {
						canvasCtx.fillText(`${data[i][j]}`, x - (metrics.width / 2), y - (textHeight / 2));
					}
				}
			}
		}

		canvasCtx.strokeStyle = "#000000";
		canvasCtx.lineWidth = 1;
		canvasCtx.lineJoin = "miter";
		canvasCtx.shadowColor = "rgba(0, 0, 0, 0)";
		canvasCtx.shadowBlur = 0;
		canvasCtx.shadowOffsetX = 0;
		canvasCtx.shadowOffsetY = 0;
		canvasCtx.font = `${fontSize}px Arial`;

		let accWidth = 0;
		let textHeight = 50;
		for (let i = 0; i < sideHeaders.length; i++) {
			accWidth += (canvasCtx.measureText(sideHeaders[i].header).width + 24);
			if (accWidth >= width) {
				accWidth = 0;
				textHeight += 80;
			}
		}

		if (height - yOffset < textHeight) {
			const image = canvasCtx.getImageData(0, 0, width, height);
			canvasRef.current.height += textHeight - (height - yOffset);
			canvasCtx.font = `${fontSize}px Arial`;
			canvasCtx.putImageData(image, 0, 0)
		}

		accWidth = 0;
		for (let i = 0; i < sideHeaders.length; i++) {
			canvasCtx.fillStyle = sideHeaders[i].color;
			canvasCtx.fillRect(xOffset + accWidth, height - yOffset + 40, 10, 10);

			canvasCtx.fillStyle = "#000000";
			canvasCtx.fillText(sideHeaders[i].header, xOffset + 14 + accWidth,
				height - yOffset + 50);
			accWidth += (canvasCtx.measureText(sideHeaders[i].header).width + 24);
			if (accWidth + canvasCtx.measureText(sideHeaders[i].header).width * 1.5 >= width) {
				accWidth = 0;
				height += 30;
			}
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
	}, [canvasRef, data, headers, sideHeaders, dimenstions.height, dimenstions.width, showDataInChart]);

	return (<div>
		<canvas style={{ backgroundColor: canvasBg }}
			width={dimenstions.width} height={dimenstions.height}
			ref={canvasRef}
		>
		</canvas>
		<Button onClick={() => canvasDownload(canvasRef, canvasBg, title)}>
			download canvas
		</Button>
	</div>
	)
}
