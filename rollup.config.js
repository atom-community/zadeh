import { createPlugins } from "rollup-plugin-atomic"

const plugins = createPlugins(["js"])

export default [
  {
    input: "src/binding/node.js",
    output: [
      {
        file: "./node-dist.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: plugins,
    external: ['node-gyp-build']
  },
]
