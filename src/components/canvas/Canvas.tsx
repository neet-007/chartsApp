import { ComponentProps, FC } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { LineChart } from "./LineChart";
import { VBarChart } from "./VBarChart";
import { HBarChart } from "./HBarChart";
import { PieChart } from "./PieChart";


export const Canvas: FC<ComponentProps<"div">> = () => {
	const { chartType } = useCanvasContext();

	return (<div>
		{
			chartType === "line" ?
				<LineChart />
				:
				chartType === "v-bar" ?
					<VBarChart />
					:
					chartType === "h-bar" ?
						<HBarChart />
						:
						<PieChart />
		}
	</div>
	)
}
