import { createPlugins } from "rollup-plugin-atomic"

const plugins = createPlugins(["ts", "js"])

const RollupConfig = [
  {
    input: "src/binding/node.ts",
    output: [
      {
        file: "./node.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins,
    external: ["node-gyp-build"],
  },
]
export default RollupConfig
