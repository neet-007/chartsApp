import { RefObject } from "react";

export function canvasDownload(canvasRef: RefObject<HTMLCanvasElement>, canvasBg: string, title: string) {
  if (!canvasRef.current) {
    return
  }
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) {
    return
  };

  const imageDataUrl = canvasRef.current.toDataURL("image/png");

  const img = new Image();
  img.src = imageDataUrl;

  img.onload = function() {
    if (!canvasRef.current) {
      return
    }
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(img, 0, 0);

    const dataURL = canvasRef.current.toDataURL('image/png', 0.9);

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${title}-canvas.png`;

    link.click();
  };


}
