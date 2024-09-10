import React, { FC, ComponentProps, useState, useContext, createContext } from "react";

type DimenstionsType = { height: number, width: number }
export type ChartType = "line" | "v-bar" | "h-bar" | "pie"

type CanvasContextType = {
  dimenstions: DimenstionsType,
  setDimenstions: React.Dispatch<React.SetStateAction<DimenstionsType>>
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>
  subTitle: string,
  setSubTitle: React.Dispatch<React.SetStateAction<string>>
  chartType: ChartType
  setChartType: React.Dispatch<React.SetStateAction<ChartType>>
  pieChartRow: number,
  setPieChartRow: React.Dispatch<React.SetStateAction<number>>
  canvasBg: string,
  setCanvasBg: React.Dispatch<React.SetStateAction<string>>
}

const INITIAL_STATE: CanvasContextType = {
  dimenstions: { height: 0, width: 0 },
  setDimenstions: () => { },
  title: "title",
  setTitle: () => { },
  subTitle: "sub title",
  setSubTitle: () => { },
  chartType: "line",
  setChartType: () => { },
  pieChartRow: 0,
  setPieChartRow: () => { },
  canvasBg: "grey",
  setCanvasBg: () => { },
};

const canvasContext = createContext<CanvasContextType>(INITIAL_STATE);

export const CanvasContextProvider: FC<ComponentProps<"div">> = ({ children }) => {
  const [dimenstions, setDimenstions] = useState<DimenstionsType>({
    height: 500,
    width: 800,
  })
  const [canvasBg, setCanvasBg] = useState<string>("gray");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [pieChartRow, setPieChartRow] = useState<number>(0);
  const [title, setTitle] = useState<string>("title");
  const [subTitle, setSubTitle] = useState<string>("sub title");

  const value = {
    dimenstions,
    setDimenstions,
    title,
    subTitle,
    setTitle,
    setSubTitle,
    chartType,
    setChartType,
    pieChartRow,
    setPieChartRow,
    canvasBg,
    setCanvasBg,
  } as CanvasContextType

  return (
    <canvasContext.Provider value={value}>
      {children}
    </canvasContext.Provider>
  )

}

export const useCanvasContext = () => useContext(canvasContext);


