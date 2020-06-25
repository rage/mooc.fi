import { PluginEntrypoint } from 'nexus/plugin'
import { Settings } from './settings'

export const moocfiAuthPlugin: PluginEntrypoint<Settings, 'required'> = (
  settings: Settings
) => ({
  settings,
  packageJsonPath: require.resolve('../package.json'),
  runtime: {
    module: require.resolve('./runtime'),
    export: 'plugin',
  },
})
