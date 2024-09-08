import React, { FC, ComponentProps, useState, useContext, createContext } from "react";

type DimenstionsType = { height: number, width: number }

type CanvasContextType = {
  dimenstions: DimenstionsType,
  setDimenstions: React.Dispatch<React.SetStateAction<DimenstionsType>>
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>
  subTitle: string,
  setSubTitle: React.Dispatch<React.SetStateAction<string>>
}

const INITIAL_STATE: CanvasContextType = {
  dimenstions: { height: 0, width: 0 },
  setDimenstions: () => { },
  title: "title",
  setTitle: () => { },
  subTitle: "sub title",
  setSubTitle: () => { },
};

const canvasContext = createContext<CanvasContextType>(INITIAL_STATE);

export const CanvasContextProvider: FC<ComponentProps<"div">> = ({ children }) => {
  const [dimenstions, setDimenstions] = useState<DimenstionsType>({
    height: 500,
    width: 800,
  })
  const [title, setTitle] = useState<string>("title");
  const [subTitle, setSubTitle] = useState<string>("sub title");

  const value = {
    dimenstions,
    setDimenstions,
    title,
    subTitle,
    setTitle,
    setSubTitle,
  } as CanvasContextType

  return (
    <canvasContext.Provider value={value}>
      {children}
    </canvasContext.Provider>
  )

}

export const useCanvasContext = () => useContext(canvasContext);


