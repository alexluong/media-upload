import { ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import { useUpload } from "../hooks/useUpload";

export default function ImageDropZoneRestPage() {
  const mediaUpload = useUpload({ initialConfig: { compression: 80 } });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => mediaUpload.selectFile(files[0]),
  });

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
        <div {...getRootProps()} style={{ padding: 20, border: "1px solid black" }}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>

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
