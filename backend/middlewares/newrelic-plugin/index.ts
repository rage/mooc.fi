import { PluginEntrypoint } from "nexus/plugin"
// @ts-ignore: for bundling
import { plugin } from "./runtime"

export const newrelicPlugin: PluginEntrypoint = () => ({
  packageJsonPath: require.resolve("../../package.json"),
  runtime: {
    module: require.resolve("./runtime"),
    export: "plugin",
  },
})
