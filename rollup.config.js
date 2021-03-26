import { createPlugins } from "rollup-plugin-atomic"

const plugins = createPlugins(["ts", "js"])

export default [
  {
    input: "src/binding/node.ts",
    output: [
      {
        file: "./node-dist.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins,
    external: ["node-gyp-build"],
  },
]
