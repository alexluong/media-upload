import express from "express";
import cors from "cors";
import multer from "multer";
import ws from "ws";
import { URL } from "url";
import { splitFileName, processImage } from "./utils";

const PORT = 8000;
const SERVER_URL = `http://localhost:${PORT}`;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer();

app.use("/images", express.static("images"));

app.post("/upload", upload.single("media"), async (request, response) => {
  const [fileName, fileExtension] = splitFileName(request.file.originalname);
  const url = await processImage({
    media: { name: fileName, extension: fileExtension, buffer: request.file.buffer },
    compression: request.body.compression,
    SERVER_URL,
  });
  response.status(200).send({ url });
});

const wss = new ws.Server({ noServer: true });
wss.on("connection", (socket) => {
  socket.on("message", async (message) => {
    const value = JSON.parse(message as string);
    const url = await processImage({
      media: value.media,
      compression: value.compression,
      SERVER_URL,
    });
    let index = 0;
    const interval = setInterval(() => {
      if (index === 10) {
        socket.send(JSON.stringify({ type: "success", url }));
        clearInterval(interval);
      } else {
        socket.send(JSON.stringify({ type: "progress", progress: index++ * 10 }));
      }
    }, 300);
  });
});

function handleUpgrade(wss: ws.Server, request: any, socket: any, head: any) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  const url = new URL(request.url, SERVER_URL);
  const pathname = url.pathname;

  switch (pathname) {
    case "/ws":
      return handleUpgrade(wss, request, socket, head);
    default:
      socket.destroy();
  }
});
