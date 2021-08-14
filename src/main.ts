import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Config, generateConfig} from './config'

export async function run(): Promise<void> {
  if (core.getInput('root') === '' && core.getInput('config') === '') {
    core.setFailed('Need either root or config set')
  }
  core.startGroup('Installing HTML5Validator')
  await exec.exec('pip', [
    'install',
    '-disable-pip-version-check',
    '--no-cache-dir ',
    '--upgrade',
    'html5validator'
  ])
  core.endGroup()
  const config: Config = await generateConfig()
  const runArgs: string[] = []
  if (config.css) {
    runArgs.push('--also-check-css')
  }
  if (config.format !== '') {
    runArgs.push(`--format ${config.format}`)
  }
  if (config.blacklisted.length !== 0) {
    runArgs.push(`--blacklisted ${config.blacklisted.join(' ')}`)
  }
  runArgs.concat(config.extra)
  if (config.config !== '') {
    await exec.getExecOutput('html5validator', [`--config ${config.config}`], {
      ignoreReturnCode: true
    })
  } else {
    await exec.getExecOutput('html5validator', runArgs, {
      ignoreReturnCode: true
    })
  }
}

run()
