import { RuntimePlugin } from 'nexus/plugin'
import { schemaPlugin } from './schema'
import { Settings } from './settings'

export const plugin: RuntimePlugin<Settings, 'required'> = (settings) => (
  project
) => ({
  schema: {
    plugins: [schemaPlugin(settings)],
  },
})
