import { ComponentProps, FC, useState } from "react";

const HEADERS = [
	"header1",
	"header2",
	"header3",
	"header4",
];
const SIDE_HEADERS = [
	"side_header1",
	"side_header2",
	"side_header3",
	"side_header4",
];

export const Spreadsheet: FC<ComponentProps<"div">> = () => {
	const [headers, setHeaders] = useState<string[]>(
		Array.from({ length: 5 }).map(() => HEADERS[Math.floor(Math.random() * HEADERS.length)])
	);
	const [sideHeaders, setSideHeaders] = useState<string[]>(
		Array.from({ length: 10 }).map(() => SIDE_HEADERS[Math.floor(Math.random() * SIDE_HEADERS.length)])
	);
	const [data, setData] = useState<(number)[][]>(
		Array.from({ length: 10 })
			.map(() => Array.from({ length: 5 })
				.map(() => Math.floor(Math.random() * 10)))

	);

	function onCellChange(row: number, col: number, v: string) {
		if (data[row][col] === Number(v)) {
			return
		}

		setData(prev => {
			const newData = [...prev];
			newData[row][col] = Number(v);

			return newData
		})
	}

	function onHeaderChange(cell: number, v: string) {
		if (headers[cell] === v) {
			return
		}

		setHeaders(prev => {
			const newData = [...prev];
			newData[cell] = v;

			return newData
		})
	}

	function onSideHeaderChange(cell: number, v: string) {
		if (sideHeaders[cell] === v) {
			return
		}

		setSideHeaders(prev => {
			const newData = [...prev];
			newData[cell] = v;

			return newData
		})
	}

	return (
		<table className="flex flex-col border-1 border-black border-collapse">
			<thead>
				<tr className="flex">
					<th className={`
					border-1 border-black
					basis-full
					bg-gray-200
					p-1`}></th>
					{
						headers.map((x, i) => (
							<th key={`header-${x}-${i}`}
								className={`
								border-1 border-black
								bg-gray-200
								basis-full
								p-1`}
								style={{
									position: "relative",
								}}>
								<div onClick={() => alert('hh')}
									style={{
										position: "absolute",
										bottom: 0,
										right: 0,
										width: "6px",
										height: "6px",
										cursor: "crosshair"
									}}
								>
								</div>
								<input type="text"
									defaultValue={x}
									className={`w-full
										outline-none
										hover:outline-blue-400
									    focus:outline-blue-400
									    active:outline-blue-400
									bg-transparent
									`}
									onBlur={e => {
										onHeaderChange(i, e.target.value)
									}}
								/>
							</th>
						))
					}
				</tr>
			</thead>
			<tbody>
				{
					data.map((x, i) => (
						<tr key={`row-${x}-${i}`}
							className={`flex w-full
								   `}>
							<td className={`
									border-1 border-black
									basis-full
									bg-gray-200
									p-1`}
								style={{
									position: "relative"
								}}
							>

								<div onClick={() => alert('hh')}
									style={{
										position: "absolute",
										bottom: 0,
										right: 0,
										width: "6px",
										height: "6px",
										cursor: "crosshair"
									}}
								>
								</div>
								<input type="text" defaultValue={sideHeaders[i]}
									className={`w-full
										outline-none
										hover:outline-blue-400
									    focus:outline-blue-400
									    active:outline-blue-400`}
									onBlur={e => {
										onSideHeaderChange(i, e.target.value)
									}}
								/>
							</td>
							{
								x.map((y, j) => (
									<td key={`data-${x}-${y}-${j}`}
										className={`
									border-1 border-black
									basis-full
									p-1`}
										style={{
											position: "relative"
										}}>
										<div onClick={() => alert('hh')}
											style={{
												position: "absolute",
												bottom: 0,
												right: 0,
												width: "6px",
												height: "6px",
												cursor: "crosshair"
											}}
										>
										</div>
										<input type="text" defaultValue={y}
											className={`w-full
										outline-none
										hover:outline-blue-400
									    focus:outline-blue-400
									    active:outline-blue-400`}
											onBlur={e => {
												onCellChange(i, j, e.target.value)
											}} />
									</td>
								))
							}
						</tr>
					))
				}
			</tbody>

		</table>
	)
}
