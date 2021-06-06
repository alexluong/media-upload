import express from "express";
import cors from "cors";
import multer from "multer";
import ws from "ws";
import { URL } from "url";
import jimp from "jimp";
import { nanoid } from "nanoid";
import { splitFileName } from "./utils";

const PORT = 4000;
const SERVER_URL = `http://localhost:${PORT}`;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer();

app.use("/images", express.static("images"));

app.get("/", (request, response) => response.status(200).send({ hello: "world" }));

app.post("/upload", upload.single("media"), async (request, response) => {
  const image = await jimp.read(request.file.buffer);
  const [fileName, fileExtension] = splitFileName(request.file.originalname);
  console.log({ fileName, fileExtension });
  const newName = `${fileName}-${nanoid()}.${fileExtension}`;
  image.write(`images/${newName}`);
  response.status(200).send({ url: `${SERVER_URL}/images/${newName}` });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

const wss = new ws.Server({ noServer: true });
wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    // let index = 0;
    // setInterval(() => socket.send(JSON.stringify({ value: index++ })), 1000);
    setTimeout(() => {
      socket.send("hello");
    }, 2000);
  });
});

function handleUpgrade(wss: ws.Server, request: any, socket: any, head: any) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
}

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
