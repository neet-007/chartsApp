import { ComponentProps, FC, useState } from "react";

export const Spreadsheet: FC<ComponentProps<"div">> = () => {
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

	return (
		<table className="flex flex-col border-1 border-black border-collapse">
			<tbody>
				{
					data.map((x, i) => (
						<tr key={`row-${x}-${i}`}
							className={`flex w-full
								   `}>
							{
								x.map((y, j) => (
									<td key={`data-${x}-${y}-${j}`}
										className={`
									border-1 border-black
									basis-full
									p-1`}>
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
