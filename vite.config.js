import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "index2.html",
    },
  },
});
