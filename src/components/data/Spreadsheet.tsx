import { ComponentProps, FC } from "react";
import { useDataContext } from "../../context/DataContext";
import { Button } from "../shared/Button";


export const Spreadsheet: FC<ComponentProps<"div">> = () => {
	const { headers, sideHeaders, data, onCellChange,
		onHeaderChange, onSideHeaderChange, addColumn, addRow } = useDataContext();

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2 items-center self-end">
				<Button onClick={addRow}>
					add row
				</Button>
				<Button onClick={addColumn}>
					add column
				</Button>
			</div>
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
									<div style={{
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
										defaultValue={x.header}
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

									<div style={{
										position: "absolute",
										bottom: 0,
										right: 0,
										width: "6px",
										height: "6px",
										cursor: "crosshair"
									}}
									>
									</div>
									<input type="text" defaultValue={sideHeaders[i].header}
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
											<div style={{
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
		</div>
	)
}
