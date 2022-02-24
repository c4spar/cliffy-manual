import {
  ExamplesDataProvider,
  serve,
} from "https://raw.githubusercontent.com/c4spar/cliffy.io/v0.0.2/mod.tsx";

await serve({
  repository: "c4spar/deno-cliffy",
  src: [{ src: "src", prefix: "/docs" }],
  providers: [{
    component: ExamplesDataProvider,
    props: { src: "examples", selected: "command.ts" },
  }],
});
