import { ComponentProps, FC, useEffect, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import { useCanvasContext } from "../../context/CanvasContext";

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


		const multY = (height - 2 * yOffset) / 10;
		const multX = (width - 2 * xOffset) / (headers.length);

		const maxVal = Math.floor(
			data.flat().reduce(
				(acc, val) => Math.max(acc, val),
				0
			)
		);

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
			canvasCtx.fillRect(xOffset + accWidth, height - 20, 10, 10);

			canvasCtx.fillStyle = "#000000";
			canvasCtx.fillText(sideHeaders[i].header, xOffset + 14 + accWidth, height - 10);
			accWidth += (canvasCtx.measureText(sideHeaders[i].header).width + 24);
			if (accWidth >= width) {
				accWidth = 0;
				height += 50;
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
	}, [canvasRef, data, headers, dimenstions.height, dimenstions.width]);

	return (<div>
		<canvas className="bg-gray-400" width={dimenstions.width} height={dimenstions.height}
			ref={canvasRef}
		>
		</canvas>
	</div>
	)
}
