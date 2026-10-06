import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";

function isValidImage(file) {
  try {
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(16);
    const n = fs.readSync(fd, buf, 0, 16, 0);
    fs.closeSync(fd);
    if (n < 4) return false;
    const hex = buf.toString("hex");
    const ascii = buf.toString("latin1");
    return (
      hex.startsWith("ffd8ff") ||                                 // JPEG
      hex.startsWith("89504e47") ||                               // PNG
      ascii.startsWith("GIF8") ||                                 // GIF
      (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") || // WebP
      ascii.slice(4, 8) === "ftyp" ||                             // AVIF / HEIC
      /^\s*(<\?xml|<svg)/i.test(fs.readFileSync(file, "utf8").slice(0, 200)) // SVG
    );
  } catch {
    return false; // missing or unreadable
  }
}

export default function remarkMissingImages({ fallback = "/placeholder.svg" } = {}) {
  return (tree, file) => {
    const mdPath = file.path ?? file.history?.[0];
    if (!mdPath) return;
    const dir = path.dirname(mdPath);

    visit(tree, "image", (node) => {
      const url = node.url;
      if (/^(https?:|\/|data:)/.test(url)) return;
      const abs = path.resolve(dir, decodeURI(url));
      if (!isValidImage(abs)) {
        console.warn(`[bad image] ${path.relative(process.cwd(), mdPath)} → ${url}`);
        node.url = fallback;
      }
    });
  };
}