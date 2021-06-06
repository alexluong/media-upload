import { useEffect, useState, useRef } from "react";
import { UploadHook } from "./useUpload";

export function useVideoPreview(upload: UploadHook) {
  const { file } = upload;
  const [videoSrc, setVideoSrc] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setVideoSrc(event.target?.result as string);
        videoRef.current.load();
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return { ref: videoRef, src: videoSrc };
}
