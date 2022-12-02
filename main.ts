import { serve } from "https://raw.githubusercontent.com/c4spar/night-owl/v0.1.4/mod.ts";

await serve({
  name: "Cliffy",
  repository: "c4spar/deno-cliffy",
  src: "./",
  nav: { collapse: true },
});
