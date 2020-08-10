import { newrelicPlugin } from "./lib/schema"
import { RuntimePlugin } from "nexus/plugin"

export const plugin: RuntimePlugin = () => (_project: any) => ({
  schema: {
    plugins: [newrelicPlugin()],
  },
})
