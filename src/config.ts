import * as core from '@actions/core'

export interface Config {
  root: string
  config: string
  extra: string
  format: string
  log_level: string
  css: boolean
  blacklist: string[]
}

export async function generateConfig(): Promise<Config> {
  const formatOption: string = core.getInput('format')
  if (
    formatOption !== '' &&
    !['json', 'xml', 'gnu', 'text'].includes(formatOption)
  ) {
    core.warning(`Unsupported format output: ${formatOption}`)
  }
  return {
    root: core.getInput('root'),
    config: core.getInput('config'),
    extra: core.getInput('extra'),
    format: formatOption,
    log_level: core.getInput('log_level'),
    css: core.getBooleanInput('css'),
    blacklist: core.getMultilineInput('blacklist')
  }
}
