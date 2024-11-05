import { serve } from "https://deno.land/x/night_owl@v0.1.24/mod.ts";

// await serve({
//   name: "Cliffy",
//   repository: "c4spar/deno-cliffy",
//   src: "./",
//   nav: { collapse: true },
// });

// import { serve } from "https://deno.land/x/night_owl@v0.1.24/mod.ts";
// import { serve } from "../night-owl/mod.ts";

await serve({
  name: "Cliffy",
  repository: "c4spar/deno-cliffy",
  src: [
    { src: "./", prefix: "/docs" },
  ],
  pages: true,
  nav: {
    collapse: true,
    items: [{
      label: "API",
      href: "https://doc.deno.land/https://deno.land/x/cliffy/mod.ts",
    }],
  },
});
