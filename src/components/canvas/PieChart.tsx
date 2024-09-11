import { ComponentProps, FC, useEffect, useRef } from "react";
import { useDataContext } from "../../context/DataContext";
import { useCanvasContext } from "../../context/CanvasContext";
import { useSetTitles } from "../../hooks/SetTitles";
import { Button } from "../shared/Button";
import { canvasDownload } from "../../utils/canvasDownload";


function hexToRgb(hex: string) {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return [r, g, b];
}

function getLuminance(r: number, g: number, b: number) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	r = (r <= 0.03928) ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
	g = (g <= 0.03928) ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
	b = (b <= 0.03928) ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastColor(hex: string) {
	const [r, g, b] = hexToRgb(hex);
	const luminance = getLuminance(r, g, b);
	return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export const PieChart: FC<ComponentProps<"div">> = () => {
	const { headers, sideHeaders, data, minMaxHeap } = useDataContext();
	const { dimenstions, title, subTitle, pieChartRow, canvasBg, showDataInChart,
		radius } = useCanvasContext();
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
		const cx = (width + xOffset - (radius / 2)) / 2;
		const cy = (height - yOffset + (radius / 2)) / 2;
		const sum = data[pieChartRow].reduce((acc, curr) => acc + curr);
		const fontSize = 16;

		canvasCtx.font = `${fontSize * 1.5}px Arial`;
		canvasCtx.fillStyle = "black";

		canvasCtx.fillText(title, (width / 2) -
			(canvasCtx.measureText(title).width / 2), fontSize * 1.5);
		canvasCtx.font = `${fontSize * 1.2}px Arial`;
		canvasCtx.fillText(subTitle, (width / 2) -
			(canvasCtx.measureText(subTitle).width / 2), (fontSize * 1.2) +
			(fontSize * 1.5) + 5);

		canvasCtx.font = `${fontSize}px Arial`;
		canvasCtx.strokeStyle = "black";

		let startAngle = 0;
		const headersColors = Array.from({ length: headers.length }, () => ({
			backgroundColor: '',
			textColor: ''
		}));

		for (let i = 0; i < data[pieChartRow].length; i++) {
			const endAngle = startAngle + ((data[pieChartRow][i] / sum) * Math.PI * 2);

			canvasCtx.beginPath();
			canvasCtx.arc(cx, cy, radius, startAngle, endAngle);
			canvasCtx.lineTo(cx, cy);

			headersColors[i] = {
				backgroundColor: headers[i].color,
				textColor: getContrastColor(headers[i].color)
			};
			canvasCtx.fillStyle = headersColors[i].backgroundColor;
			canvasCtx.fill();

			const startX = cx + radius * Math.cos(startAngle);
			const startY = cy + radius * Math.sin(startAngle);
			const endX = cx + radius * Math.cos(endAngle);
			const endY = cy + radius * Math.sin(endAngle);

			canvasCtx.beginPath();
			canvasCtx.moveTo(cx, cy);
			canvasCtx.lineTo(startX, startY);
			canvasCtx.stroke();

			canvasCtx.beginPath();
			canvasCtx.moveTo(cx, cy);
			canvasCtx.lineTo(endX, endY);
			canvasCtx.stroke();

			if (data[pieChartRow][i] > 0 && showDataInChart) {
				const middleAngle = startAngle + (endAngle - startAngle) / 2;
				const textX = cx + (radius / 2) * Math.cos(middleAngle);
				const textY = cy + (radius / 2) * Math.sin(middleAngle);

				canvasCtx.fillStyle = headersColors[i].textColor;
				canvasCtx.textAlign = 'center';
				canvasCtx.textBaseline = 'middle';
				canvasCtx.fillText(`${data[pieChartRow][i]}`, textX, textY);
			}

			startAngle = endAngle;
		}

		let accWidth = 0;
		let textHeight = 50;
		for (let i = 0; i < headers.length; i++) {
			accWidth += (canvasCtx.measureText(headers[i].header).width + 24);
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
		for (let i = 0; i < headers.length; i++) {
			canvasCtx.fillStyle = headersColors[i].backgroundColor;
			canvasCtx.fillRect(xOffset + accWidth, height - yOffset + 40, 10, 10);

			canvasCtx.fillStyle = "#000000";
			canvasCtx.fillText(headers[i].header, xOffset + 44 + accWidth,
				height - yOffset + 50);
			accWidth += (canvasCtx.measureText(headers[i].header).width + 24);
			if (accWidth + canvasCtx.measureText(headers[i].header).width * 1.5 >= width) {
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
	}, [canvasRef, data, headers, sideHeaders, dimenstions.height, dimenstions.width,
		pieChartRow, showDataInChart, radius]);

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
