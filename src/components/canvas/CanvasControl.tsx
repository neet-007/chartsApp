import { ChangeEvent, ComponentProps, FC, useState } from "react";
import { ChartType, useCanvasContext } from "../../context/CanvasContext";
import { Input } from "../shared/Input";
import { useDataContext } from "../../context/DataContext";

export const CanvasControl: FC<ComponentProps<"div">> = () => {
	const [isControlOpen, setIsControlOpen] = useState<boolean>(true);
	const { dimenstions, setDimenstions,
		title, subTitle, setTitle, setSubTitle,
		chartType, setChartType, pieChartRow, setPieChartRow, canvasBg,
		setCanvasBg, showDataInChart, setShowDataInChart, radius, setRadius } = useCanvasContext()
	const { headers, sideHeaders, setSideHeadersColors, setHeadersColors, data } = useDataContext();

	return (
		<div>
			<button className={`fixed right-0 top-0 z-50 bg-white 
					   transition-opacity duration-500 ease-in-out
					   ${isControlOpen ? "opacity-0" : "opacity-full"}`}
				onClick={() => setIsControlOpen(true)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
				</svg>
			</button>
			<div className={`fixed top-0 z-50 bg-white
				p-9 overflow-y-scroll h-full flex flex-col gap-2
				transition-right duration-500 ease-in-out
				${isControlOpen ? "right-0" : "right-[-100%]"}`}>
				<div className="mb-2 font-bold text-2xl flex justify-between items-center">
					<p>Canvas Control</p>
					<button onClick={() => setIsControlOpen(false)}>X</button>
				</div>
				<Input title="height" value={dimenstions.height}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setDimenstions(prev => ({ ...prev, height: Number(e.target.value) }))}
					type="range"
					max={2000}
					min={100} />

				<Input title="width" value={dimenstions.width}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setDimenstions(prev => ({ ...prev, width: Number(e.target.value) }))}
					type="range"
					max={2000}
					min={100} />

				<Input title="set title" defaultValue={title} type="text"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />

				<Input title="set sub title" defaultValue={subTitle} type="text"
					onChange={(e: ChangeEvent<HTMLInputElement>) => setSubTitle(e.target.value)} />

				<Input title="canvas background" defaultValue={canvasBg}
					type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setCanvasBg(e.target.value)
					}} />
				<div>
					<label htmlFor="show data in chart">show data in chart</label>
					<input type="checkbox" id="show data in chart" name="show data in chart"
						defaultChecked={showDataInChart} onChange={e => setShowDataInChart(e.target.checked)} />
				</div>

				{chartType === "pie" &&
					<div>
						<label htmlFor="set pie chart row">set pie chart row</label>
						<select name="set pie chart row" id="set pie chart row"
							defaultValue={pieChartRow}
							onChange={e => {
								setPieChartRow(prev => Number(e.target.value) >= data.length ? prev : Number(e.target.value))
							}}
							className="bg-white border-2 border-black">
							{data.map((_, i) => (
								<option key={`pie-chart-${i}`} value={i}>
									{i + 1}
								</option>
							))}
						</select>
					</div>
				}
				{chartType === "pie" &&
					<Input title="set radius" defaultValue={radius} type="number"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setRadius(Number(e.target.value))} />

				}
				<div>
					<label htmlFor="chart-type">chart type</label>
					<select name="chart-type" id="chart-type"
						defaultValue={chartType}
						onChange={e => setChartType(e.target.value as ChartType)}
						className="bg-white border-2 border-black">
						<option value="line">
							line
						</option>
						<option value="v-bar">
							vertical bar
						</option>
						<option value="h-bar">
							horizontal bar
						</option>
						<option value="pie">
							pie chart
						</option>
					</select>
				</div>
				{chartType === "pie" &&
					<div>
						<p>headers colors</p>
						<div>
							{headers.map((x, i) => (
								<div className="flex gap-1 items-center"
									key={`${x}-${i}-header-color-input`}>
									<Input
										title={x.header}
										defaultValue={x.color}
										type="text"
										onChange={(e: ChangeEvent<HTMLInputElement>) => setHeadersColors(i, e.target.value)} />
									<div style={{
										width: "1rem",
										height: "1rem",
										borderRadius: "50%",
										backgroundColor: x.color
									}}>
									</div>
								</div>
							))
							}
						</div>
					</div>
				}
				<div>
					<p>side headers colors</p>
					<div>
						{sideHeaders.map((x, i) => (
							<div className="flex gap-1 items-center"
								key={`${x}-${i}-side-headercolor-input`}>

								<Input title={x.header}
									defaultValue={x.color}
									type="text"
									onChange={(e: ChangeEvent<HTMLInputElement>) => setSideHeadersColors(i, e.target.value)} />
								<div style={{
									width: "1rem",
									height: "1rem",
									borderRadius: "50%",
									backgroundColor: x.color
								}}>
								</div>
							</div>
						))
						}
					</div>
				</div>
				<div id="download-button">

				</div>
			</div>
		</div>
	)
}
