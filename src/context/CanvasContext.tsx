import React, { FC, ComponentProps, useState, useContext, createContext } from "react";

type DimenstionsType = { height: number, width: number }

type CanvasContextType = {
  dimenstions: DimenstionsType,
  setDimenstions: React.Dispatch<React.SetStateAction<DimenstionsType>>
}

const INITIAL_STATE: CanvasContextType = {
  dimenstions: { height: 0, width: 0 },
  setDimenstions: () => { },
};

const canvasContext = createContext<CanvasContextType>(INITIAL_STATE);

export const CanvasContextProvider: FC<ComponentProps<"div">> = ({ children }) => {
  const [dimenstions, setDimenstions] = useState<DimenstionsType>({
    height: 300,
    width: 500,
  })

  const value = {
    dimenstions,
    setDimenstions
  } as CanvasContextType

  return (
    <canvasContext.Provider value={value}>
      {children}
    </canvasContext.Provider>
  )

}

export const useCanvasContext = () => useContext(canvasContext);


