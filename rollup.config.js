import { createPlugins } from "rollup-plugin-atomic"

const plugins = createPlugins(["ts", "js"])

const RollupConfig = [
  {
    input: "src/binding/index.ts",
    output: [
      {
        file: "./index.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins,
    external: ["node-gyp-build"],
  },
]
export default RollupConfig
