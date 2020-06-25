import { RuntimePlugin } from 'nexus/plugin'
import { schemaPlugin } from './schema'
import { Settings } from './settings'

export const plugin: RuntimePlugin<Settings, 'required'> = (
  settings: Settings
) => (_project: any) => ({
  schema: {
    plugins: [schemaPlugin(settings)],
  },
})
