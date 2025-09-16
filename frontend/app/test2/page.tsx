"use client";

import React, { useRef } from "react";

export default function ImageOutline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 원본 크기 맞추기
        canvas.width = img.width;
        canvas.height = img.height;

        // 원본 이미지 그리기
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // 외곽선 그리기
        drawOutline(ctx, canvas.width, canvas.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawOutline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.beginPath();

    // 각 픽셀 확인
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3]; // 현재 픽셀 알파값

        if (alpha > 0) {
          // 주변 픽셀 중 하나라도 투명(알파=0)이면 외곽선 픽셀
          const neighbors = [
            data[((y - 1) * width + x) * 4 + 3],
            data[((y + 1) * width + x) * 4 + 3],
            data[(y * width + (x - 1)) * 4 + 3],
            data[(y * width + (x + 1)) * 4 + 3],
          ];
          if (neighbors.some((a) => a === 0)) {
            ctx.rect(x, y, 1, 1); // 점 찍듯이 흰색 외곽선
          }
        }
      }
    }

    ctx.stroke();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
}
