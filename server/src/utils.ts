import fs from "fs";
import path from "path";
import jimp from "jimp";
import { nanoid } from "nanoid";

export function splitFileName(name: string) {
  const index = name.lastIndexOf(".");
  return [name.slice(0, index), name.slice(index + 1)];
}

export interface Media {
  name: string;
  extension: string;
  base64?: string;
  buffer?: Buffer;
}

export async function processImage({
  media,
  compression,
  SERVER_URL,
}: {
  media: Media;
  compression: string | number;
  SERVER_URL: string;
}) {
  if (!fs.existsSync("images")) {
    fs.mkdirSync("images");
  }
  const newFileName = `${media.name}-${nanoid()}.jpg`;
  const image = await jimp.read(media.buffer || Buffer.from(media.base64 as string));
  image.quality(Number(compression)).write(`images/${newFileName}`);
  return `${SERVER_URL}/images/${newFileName}`;
}
