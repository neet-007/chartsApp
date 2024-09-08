import { FC, ComponentProps, useState, useContext, createContext } from "react";

type DataContextType = {
  headers: string[];
  sideHeaders: { header: string, color: string }[];
  data: number[][];
  onCellChange: (row: number, col: number, v: string) => void;
  onHeaderChange: (cell: number, v: string) => void;
  onSideHeaderChange: (cell: number, v: string) => void;
}

const INITIAL_STATE: DataContextType = {
  headers: [],
  sideHeaders: [],
  data: [],
  onCellChange: () => { },
  onHeaderChange: () => { },
  onSideHeaderChange: () => { },
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
  const [headers, setHeaders] = useState<string[]>(
    Array.from({ length: 5 }).map(() => HEADERS[Math.floor(Math.random() * HEADERS.length)])
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
    if (sideHeaders[cell].header === v) {
      return
    }

    setSideHeaders(prev => {
      const newData = [...prev];
      newData[cell].header = v;

      return newData
    })
  }

  const value = {
    headers,
    sideHeaders,
    data,
    onCellChange,
    onHeaderChange,
    onSideHeaderChange
  } as DataContextType

  return (
    <dataContext.Provider value={value}>
      {children}
    </dataContext.Provider>
  )

}

export const useDataContext = () => useContext(dataContext);


