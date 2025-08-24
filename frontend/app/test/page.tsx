"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Preview = { url: string; file: File };

export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const next: Preview = {
      url: URL.createObjectURL(file),
      file,
    };

    // 이전 미리보기 정리
    if (preview) URL.revokeObjectURL(preview.url);

    setPreview(next);
  }, [preview]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFile(e.dataTransfer.files[0]); // 첫 번째 파일만
      e.dataTransfer.clearData();
    }
  };

  const onClickDropZone = () => inputRef.current?.click();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) addFile(e.target.files[0]);
    e.target.value = ""; // 같은 파일 다시 선택 가능
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* 상단 링크 */}
      <div className="w-full p-2 text-left">
        <Link href="/about" className="underline">
          About 페이지
        </Link>
      </div>

      {/* 중앙 상단 이미지 2개 */}
      <div className="flex gap-8 mt-8">
        <img src="/img1.png" alt="img1" className="w-40 h-40 object-contain" />
        <img src="/img2.png" alt="img2" className="w-40 h-40 object-contain" />
      </div>

      {/* 드래그 앤 드롭 영역 */}
      <div className="mt-8 w-96">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onClickDropZone}
          className={[
            "h-40 border-2 rounded-xl flex items-center justify-center text-center transition-all cursor-pointer",
            isDragging ? "border-blue-400 bg-blue-950/30" : "border-gray-500/70 hover:border-gray-300/90",
          ].join(" ")}
        >
          <div className="px-4">
            <p className="font-semibold">이미지 업로드</p>
            <p className="text-sm text-gray-300 mt-1">드래그하거나 클릭해서 선택</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF</p>
          </div>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onChangeInput}
          className="hidden"
        />
      </div>

      {/* URL 입력 + 버튼 */}
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="이미지 주소입력"
          className="p-2 border border-gray-500 text-black w-80"
        />
        <button className="ml-2 px-4 bg-gray-700 hover:bg-gray-600 rounded">
          변환
        </button>
      </div>

      {/* 미리보기 */}
      {preview && (
        <div className="mt-6">
          <div
            className="relative w-40 h-40 rounded-xl overflow-hidden border border-white/20"
            title={preview.file.name}
          >
            <Image
              src={preview.url}
              alt={preview.file.name}
              fill
              className="object-cover"
              unoptimized
              sizes="160px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
