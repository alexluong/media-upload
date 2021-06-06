import { ChangeEvent, useEffect, useRef } from "react";
import { fileToBase64 } from "../utils/helpers";
import { useUpload } from "../hooks/useUpload";

export default function ImageWsPage() {
  const socketRef = useRef<WebSocket>();

  const mediaUpload = useUpload({ initialConfig: { compression: 80 } });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");
    socketRef.current = socket;

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case "progress":
            return mediaUpload.updateProgress(message.progress);
          case "success":
            return mediaUpload.finishUpload(message.url);
          case "error":
            throw new Error(message.error);
          default:
        }
      } catch (error) {
        mediaUpload.failUpload(error);
      }
    });

    socket.addEventListener("close", () => {
      console.log("closed");
    });

    return () => {
      if (socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
    };
  }, []);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      mediaUpload.selectFile(event.target.files[0]);
    }
  }

  async function upload() {
    const base64 = await fileToBase64(mediaUpload.file);
    const [_, base64WithoutMeta] = base64.split(",");
    if (socketRef.current) {
      mediaUpload.startUpload();
      socketRef.current.send(
        JSON.stringify({
          media: {
            name: mediaUpload.file.name,
            type: mediaUpload.file.type,
            base64: base64WithoutMeta,
          },
          compression: mediaUpload.config.compression,
        }),
      );
    }
  }

  return (
    <div>
      <pre>{JSON.stringify(mediaUpload, null, 4)}</pre>

      <div>
        <input type="file" accept="image/*" onChange={onChange} />
        <br />
        <input
          type="range"
          min="1"
          max="100"
          value={mediaUpload.config.compression}
          onChange={(e) => mediaUpload.updateConfig({ compression: Number(e.target.value) })}
        />
        <button onClick={upload}>Upload</button>
      </div>
    </div>
  );
}
