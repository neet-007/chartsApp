import { RefObject, useEffect, useRef } from "react";

export function useSetTitles(canvasRef: RefObject<HTMLCanvasElement>, title: string, subTitle: string) {
  const prevTitleRef = useRef(title);
  const prevSubTitleRef = useRef(subTitle);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvasCtx = canvasRef.current.getContext("2d", { willReadFrequently: true });
    if (!canvasCtx) {
      return;
    }

    const fontSize = 16;
    const width = canvasRef.current.width;

    const prevTitle = prevTitleRef.current;
    const prevSubTitle = prevSubTitleRef.current;

    canvasCtx.fillStyle = "black";
    if (prevTitle !== title) {
      canvasCtx.clearRect(
        0,
        0,
        width,
        fontSize * 1.5 + 5
      );
      canvasCtx.font = `${fontSize * 1.5}px Arial`;
      canvasCtx.fillText(title, (width / 2) - (canvasCtx.measureText(title).width / 2), fontSize * 1.5);
    }

    if (prevSubTitle !== subTitle) {
      canvasCtx.clearRect(
        0,
        fontSize * 1.5 + 5,
        width,
        fontSize * 1.2 + 5
      );

      canvasCtx.font = `${fontSize * 1.2}px Arial`;
      canvasCtx.fillText(subTitle, (width / 2) - (canvasCtx.measureText(subTitle).width / 2), (fontSize * 1.5) + fontSize * 1.2 + 5);
    }

    prevTitleRef.current = title;
    prevSubTitleRef.current = subTitle;

  }, [title, subTitle]);
}
