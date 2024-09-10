import { FC, ComponentProps, useState, useContext, createContext, useEffect } from "react";
import { MinMaxHeap } from "../minMaxHeap";

type DataContextType = {
  headers: { header: string, color: string }[];
  sideHeaders: { header: string, color: string }[];
  data: number[][];
  minMaxHeap: MinMaxHeap;
  onCellChange: (row: number, col: number, v: string) => void;
  onHeaderChange: (cell: number, v: string) => void;
  onSideHeaderChange: (cell: number, v: string) => void;
  setSideHeadersColors: (t: number, color: string) => void;
  setHeadersColors: (t: number, color: string) => void;
}

const INITIAL_STATE: DataContextType = {
  headers: [],
  sideHeaders: [],
  data: [],
  minMaxHeap: new MinMaxHeap(),
  onCellChange: () => { },
  onHeaderChange: () => { },
  onSideHeaderChange: () => { },
  setSideHeadersColors: () => { },
  setHeadersColors: () => { },
};

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

const dataContext = createContext<DataContextType>(INITIAL_STATE);

function generateRandomColor() {
  let maxVal = 0xFFFFFF;
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  const randomNumberString = randomNumber.toString(16);
  const randColor = randomNumberString.padStart(6, "0");
  return `#${randColor.toUpperCase()}`
}

export const DataContextProvider: FC<ComponentProps<"div">> = ({ children }) => {
  const [headers, setHeaders] = useState<{ header: string, color: string }[]>(
    Array.from({ length: 5 }).map(() => ({
      header: HEADERS[Math.floor(Math.random() * HEADERS.length)],
      color: generateRandomColor(),
    }))
  );
  const [sideHeaders, setSideHeaders] = useState<{ header: string, color: string }[]>(
    Array.from({ length: 10 }).map(() => ({
      header: SIDE_HEADERS[Math.floor(Math.random() * SIDE_HEADERS.length)],
      color: generateRandomColor(),
    }))
  );
  const [data, setData] = useState<(number)[][]>(
    Array.from({ length: 10 })
      .map(() => Array.from({ length: 5 })
        .map(() => Math.floor(Math.random() * 10)))

  );
  const [minMaxHeap, _] = useState<MinMaxHeap>(new MinMaxHeap());

  useEffect(() => {
    minMaxHeap.buildHeap(data.flat());
  }, [])

  function onCellChange(row: number, col: number, v: string) {
    if (data[row][col] === Number(v)) {
      return
    }

    setData(prev => {
      const newData = [...prev];
      minMaxHeap.update(newData[row][col], Number(v), 1);

      newData[row][col] = Number(v);

      return newData
    })
  }

  function onHeaderChange(cell: number, v: string) {
    if (headers[cell].header === v) {
      return
    }

    setHeaders(prev => {
      const newData = [...prev];
      newData[cell].header = v;

      return newData
    })
  }

  function onSideHeaderChange(cell: number, v: string) {
    if (sideHeaders[cell].header === v) {
      return
    }

    setSideHeaders(prev => {
      const newData = [...prev];
      newData[cell].header = v;

      return newData
    })
  }

  function setHeadersColors(t: number, color: string) {
    setHeaders(prev => prev.map((x, i) => i === t ? { ...x, color } : x))
  }

  function setSideHeadersColors(t: number, color: string) {
    setSideHeaders(prev => prev.map((x, i) => i === t ? { ...x, color } : x))
  }

  const value = {
    headers,
    sideHeaders,
    data,
    minMaxHeap,
    onCellChange,
    onHeaderChange,
    onSideHeaderChange,
    setHeadersColors,
    setSideHeadersColors,
  } as DataContextType

  return (
    <dataContext.Provider value={value}>
      {children}
    </dataContext.Provider>
  )

}

export const useDataContext = () => useContext(dataContext);


