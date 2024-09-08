import { ComponentProps, FC, useEffect, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import { useCanvasContext } from "../../context/CanvasContext";

function generateSteps(minVal: number, maxVal: number, cap: number) {
	const range = maxVal - minVal;

	const numSteps = Math.min(cap, range);

	return Math.ceil(range / numSteps);
}

export const Canvas: FC<ComponentProps<"div">> = () => {
	const { headers, sideHeaders, data } = useDataContext();
	const { dimenstions, title, subTitle } = useCanvasContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const prevTitleRef = useRef(title);
	const prevSubTitleRef = useRef(subTitle);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvasCtx = canvasRef.current.getContext("2d", { willReadFrequently: true });
		if (!canvasCtx) {
			return;
		}

		const fontSize = 16;
		const width = canvasRef.current.width;

		const prevTitle = prevTitleRef.current;
		const prevSubTitle = prevSubTitleRef.current;

		canvasCtx.fillStyle = "black";
		if (prevTitle !== title) {
			canvasCtx.clearRect(
				0,
				0,
				width,
				fontSize * 1.5 + 5
			);
			canvasCtx.font = `${fontSize * 1.5}px Arial`;
			canvasCtx.fillText(title, (width / 2) - (canvasCtx.measureText(title).width / 2), fontSize * 1.5);
		}

		if (prevSubTitle !== subTitle) {
			canvasCtx.clearRect(
				0,
				fontSize * 1.5 + 5,
				width,
				fontSize * 1.2 + 5
			);

			canvasCtx.font = `${fontSize * 1.2}px Arial`;
			canvasCtx.fillText(subTitle, (width / 2) - (canvasCtx.measureText(subTitle).width / 2), (fontSize * 1.5) + fontSize * 1.2 + 5);
		}

		prevTitleRef.current = title;
		prevSubTitleRef.current = subTitle;

	}, [title, subTitle]);

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

		canvasCtx.clearRect(0, 0, width, height);

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

		for (let i = 0; i < headers.length; i++) {
			if (i === 0) {
				canvasCtx.fillText(headers[i],
					xOffset + i * multX,
					height - yOffset + 20);
				continue
			}
			canvasCtx.fillText(headers[i],
				xOffset + i * multX - canvasCtx.measureText(headers[i]).width / 2,
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

		for (let i = 0; i < data.length; i++) {
			const line = new Path2D();
			line.moveTo(
				xOffset,
				yOffset + (1 - data[i][0] / maxVal) * (height - 2 * yOffset)
			);
			const metrics = canvasCtx.measureText(`${data[i][0]}`);
			const textHeight = (metrics.fontBoundingBoxAscent
				+ metrics.fontBoundingBoxDescent);

			canvasCtx.font = `${fontSize}px Arial`;
			canvasCtx.fillStyle = "black";
			canvasCtx.globalCompositeOperation = 'destination-over';
			canvasCtx.fillText(data[i][0].toString(),
				xOffset,
				yOffset + (1 - data[i][0] / maxVal) * (height - 2 * yOffset) - textHeight / 2
			);

			for (let j = 1; j < data[i].length; j++) {
				const metrics = canvasCtx.measureText(`${data[i][j]}`);
				const textHeight = (metrics.fontBoundingBoxAscent
					+ metrics.fontBoundingBoxDescent);

				line.lineTo(
					xOffset + j * multX,
					yOffset + (1 - data[i][j] / maxVal) * (height - 2 * yOffset)
				);

				canvasCtx.font = `${fontSize}px Arial`;
				canvasCtx.fillStyle = "black";
				canvasCtx.globalCompositeOperation = 'destination-over';
				canvasCtx.fillText(data[i][j].toString(),
					xOffset + j * multX,
					yOffset + (1 - data[i][j] / maxVal) * (height - 2 * yOffset - textHeight / 2)
				);

			}
			canvasCtx.globalCompositeOperation = 'source-over';
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
	}, [canvasRef, data, headers, sideHeaders, dimenstions.height, dimenstions.width]);

	return (<div>
		<canvas className="bg-gray-400" width={dimenstions.width} height={dimenstions.height}
			ref={canvasRef}
		>
		</canvas>
	</div>
	)
}
