"use client";

import React, { useRef, useState, useEffect } from "react";
import { isoLines } from "marching-squares"; // npm i marching-squares

export default function KeyRingEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // 상태값들
  const [outlineWidth, setOutlineWidth] = useState(8);
  const [ringOuter, setRingOuter] = useState(80);
  const [ringInner, setRingInner] = useState(40);
  const [imageScale, setImageScale] = useState(1.0);

  // 드래그 상태
  const [dragging, setDragging] = useState<"image" | "ring" | null>(null);
  const [imagePos, setImagePos] = useState({ x: 300, y: 300 });
  const [ringPos, setRingPos] = useState({ x: 400, y: 120 });

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => setImage(img);
    };
    reader.readAsDataURL(file);
  };

 // 이미지 + 알파 기반 외곽선 그리기
 const drawImageWithOutline = (
   ctx: CanvasRenderingContext2D,
   img: HTMLImageElement,
   x: number,
   y: number,
   scale: number
 ) => {
   const drawWidthF = img.width * scale;
   const drawHeightF = img.height * scale;

   // 임시 캔버스에서 알파맵 추출
   const tempW = Math.max(1, Math.round(drawWidthF));
   const tempH = Math.max(1, Math.round(drawHeightF));
   const tempCanvas = document.createElement("canvas");
   tempCanvas.width = tempW;
   tempCanvas.height = tempH;
   const tempCtx = tempCanvas.getContext("2d")!;
   tempCtx.drawImage(img, 0, 0, tempW, tempH);

   const imageData = tempCtx.getImageData(0, 0, tempW, tempH);
   const alphaMap: number[][] = new Array(tempH);
   for (let ry = 0; ry < tempH; ry++) {
     const row = new Array<number>(tempW);
     for (let rx = 0; rx < tempW; rx++) {
       const idx = (ry * tempW + rx) * 4 + 3;
       row[rx] = imageData.data[idx] > 128 ? 1 : 0;
     }
     alphaMap[ry] = row;
   }

   // marching-squares 실행
   let contours: number[][][] = [];
   try {
     contours = isoLines(alphaMap, [0.5], { noFrame: true });
   } catch (err) {
     console.error("isoLines error:", err);
     contours = [];
   }

   // 1) 외곽선 먼저 그림
   ctx.strokeStyle = "white";
   ctx.lineWidth = outlineWidth;
   ctx.lineJoin = "round";
   ctx.lineCap = "round";

   if (contours && contours.length > 0 && contours[0].length > 0) {
     contours[0].forEach((path) => {
       if (!path || path.length === 0) return;

       ctx.beginPath();
       for (let i = 0; i < path.length; i++) {
         const [px, py] = path[i];

         const gx = x - drawWidthF / 2 + px;
         const gy = y - drawHeightF / 2 + py;

         if (i === 0) ctx.moveTo(gx, gy);
         else ctx.lineTo(gx, gy);
       }
       ctx.closePath();
       ctx.stroke();
     });
   } else {
     // fallback: 사각형 외곽
     ctx.strokeStyle = "white";
     ctx.lineWidth = outlineWidth;
     ctx.strokeRect(x - drawWidthF / 2, y - drawHeightF / 2, drawWidthF, drawHeightF);
   }

   // 2) 이미지 위에 덮어쓰기
   ctx.drawImage(img, x - drawWidthF / 2, y - drawHeightF / 2, drawWidthF, drawHeightF);
 };

  // 드로잉
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 이미지 + 외곽선
    if (image) {
      drawImageWithOutline(ctx, image, imagePos.x, imagePos.y, imageScale);
    }

    // 링
    const { x: rx, y: ry } = ringPos;
    ctx.beginPath();
    ctx.arc(rx, ry, ringOuter, 0, Math.PI * 2);
    ctx.arc(rx, ry, ringInner, 0, Math.PI * 2, true);
    ctx.fillStyle = "white";
    ctx.fill("evenodd");
  }, [image, imagePos, ringPos, outlineWidth, ringOuter, ringInner, imageScale]);

  // 드래그 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (image) {
      const drawWidth = image.width * imageScale;
      const drawHeight = image.height * imageScale;
      if (
        offsetX > imagePos.x - drawWidth / 2 &&
        offsetX < imagePos.x + drawWidth / 2 &&
        offsetY > imagePos.y - drawHeight / 2 &&
        offsetY < imagePos.y + drawHeight / 2
      ) {
        setDragging("image");
        return;
      }
    }
    const dist = Math.hypot(offsetX - ringPos.x, offsetY - ringPos.y);
    if (dist < ringOuter) setDragging("ring");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const { offsetX, offsetY } = e.nativeEvent;
    if (dragging === "image") setImagePos({ x: offsetX, y: offsetY });
    else if (dragging === "ring") setRingPos({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = () => setDragging(null);

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-black text-white">
      {/* 상단 제목 */}
      <a href="/" className="absolute top-2 left-2 text-blue-400 underline">
        Png To KeyRing
      </a>

      {/* 캔버스 */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="bg-gray-700 mt-8"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* 파일 업로드 */}
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-4" />

      {/* 슬라이더 UI */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-4">
        <label>
          키링 외곽선 두께
          <input
            type="range"
            min="1"
            max="20"
            value={outlineWidth}
            onChange={(e) => setOutlineWidth(Number(e.target.value))}
          />
        </label>
        <label>
          이미지 크기
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={imageScale}
            onChange={(e) => setImageScale(Number(e.target.value))}
          />
        </label>
        <label>
          링 크기
          <input
            type="range"
            min="20"
            max="200"
            value={ringOuter}
            onChange={(e) => setRingOuter(Number(e.target.value))}
          />
        </label>
        <label>
          링 속 비움
          <input
            type="range"
            min="5"
            max="150"
            value={ringInner}
            onChange={(e) => setRingInner(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
