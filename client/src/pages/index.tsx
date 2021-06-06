import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/image-rest">Image - REST</Link>
      </li>
      <li>
        <Link href="/image-rest">Image with DropZone - REST</Link>
      </li>
      <li>
        <Link href="/image-ws">Image - WebSocket</Link>
      </li>
      <li>
        <Link href="/video">Video</Link>
      </li>
    </ul>
  );
}
