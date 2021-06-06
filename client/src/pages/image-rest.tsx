import { ChangeEvent } from "react";
import { useUpload } from "../hooks/useUpload";

export default function ImageRestPage() {
  const mediaUpload = useUpload({ initialConfig: { compression: 80 } });

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      mediaUpload.selectFile(event.target.files[0]);
    }
  }

  async function upload() {
    try {
      mediaUpload.startUpload();
      const data = new FormData();
      data.append("media", mediaUpload.file);
      data.append("compression", String(mediaUpload.config.compression));
      const { url } = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: data,
      }).then((response) => response.json());
      mediaUpload.finishUpload(url);
    } catch (error) {
      mediaUpload.failUpload(error);
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
        {mediaUpload.status === "success" && (
          <img src={mediaUpload.uploadedSrc} style={{ width: 500 }} />
        )}
      </div>
    </div>
  );
}
