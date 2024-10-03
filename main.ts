import { serve } from "https://deno.land/x/night_owl@v0.1.27/mod.ts";

await serve({
  name: "Cliffy",
  repository: "c4spar/deno-cliffy",
  src: "./",
  nav: { collapse: true },
});
