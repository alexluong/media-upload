import { ChangeEvent, useState } from "react";
import { useUpload } from "../hooks/useUpload";
import { useVideoPreview } from "../hooks/useVideoPreview";

export default function VideoPage() {
  const mediaUpload = useUpload({ initialConfig: { compression: 80 } });
  const videoPreview = useVideoPreview(mediaUpload);
  const [isUploaded, setIsUploaded] = useState(false);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      mediaUpload.selectFile(event.target.files[0]);
    }
  }

  async function upload() {
    setIsUploaded(true);
  }

  return (
    <div>
      <pre>{JSON.stringify(mediaUpload, null, 4)}</pre>

      <div>
        <input type="file" accept="video/*" onChange={onChange} />
        <br />
        <input
          type="range"
          min="1"
          max="100"
          value={mediaUpload.config.compression}
          onChange={(e) => mediaUpload.updateConfig({ compression: Number(e.target.value) })}
        />
        {videoPreview.src && (
          <>
            <br />
            <video controls ref={videoPreview.ref}>
              <source src={videoPreview.src} />
              Your browser does not support the video tag.
            </video>
            <br />
          </>
        )}
        <button onClick={upload}>Upload</button>
        {isUploaded && <p>Uploaded</p>}
      </div>
    </div>
  );
}
