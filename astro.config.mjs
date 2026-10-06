import { defineConfig } from "astro/config";
import remarkMissingImages from "./remark-missing-images.mjs";

export default defineConfig({
  site: "https://blog.cissou.me",
  markdown: { remarkPlugins: [remarkMissingImages] },
});
