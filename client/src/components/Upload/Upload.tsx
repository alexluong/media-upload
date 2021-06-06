import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useUpload, UploadState, UploadActions } from "./useUpload";
import { useVideoPreview } from "./useVideoPreview";

interface Config {
  compression: number;
}

// async function uploadMedia(state: UploadState<Config>, actions: UploadActions<Config>) {
//   // const data = new FormData();
//   // data.append("media", state.file);
//   // data.append("compression", String(state.config.compression));
//   // const { url } = await fetch("http://localhost:4000/upload", {
//   //   method: "POST",
//   //   body: data,
//   // }).then((response) => response.json());
//   // return url;

//   const socket = new WebSocket("ws://localhost:4000/ws");

//   socket.addEventListener("open", function (event) {
//     socket.send("Hello Server!");
//   });

//   // Listen for messages
//   socket.addEventListener("message", function (event) {
//     console.log("Message from server ", event.data);
//     console.log(event);
//     socket.close();
//     return "hola";
//   });

//   return "hi";
// }

export function Upload() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000/ws");

    socket.addEventListener("open", () => {
      setSocket(socket);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      socket.close();
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

  const uploadMedia = useCallback(
    async (state: UploadState<Config>, actions: UploadActions<Config>) => {
      socket.send("hi");
      return "";
    },
    [socket],
  );

  const upload = useUpload({ initialConfig: { compression: 80 }, upload: uploadMedia });

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      upload.selectFile(event.target.files[0]);
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={onChange} />
      <br />
      <input
        type="range"
        min="1"
        max="100"
        value={upload.config.compression}
        onChange={(e) => upload.updateConfig({ compression: Number(e.target.value) })}
      />
      <div>Progress: {upload.progress}</div>
      <pre>{JSON.stringify(upload, null, 4)}</pre>
      <button onClick={() => upload.upload()}>Upload</button>
    </div>
  );
}

// export function Upload() {
//   const upload = useUpload();
//   const videoPreview = useVideoPreview(upload);

//   return (
//     <div>
//       <input type="file" accept="video/*" onChange={upload.onChange} />
//       <br />
//       <div>Progress: {upload.progress}</div>
//       <button onClick={() => uploadMedia(upload)}>Upload</button>
//       <br />
//       {videoPreview.src && (
//         <video controls ref={videoPreview.ref}>
//           <source src={videoPreview.src} />
//           Your browser does not support the video tag.
//         </video>
//       )}
//     </div>
//   );
// }
