import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {Config, generateConfig} from './config'

export async function run(): Promise<void> {
  if (core.getInput('root') === '' && core.getInput('config') === '') {
    core.setFailed('Need either root or config set')
    return
  }

  const wheelInstall = await exec.getExecOutput(
    'pip3',
    [
      '--disable-pip-version-check',
      '--no-cache-dir',
      '--install',
      'wheel'
    ],
    {ignoreReturnCode: true}
  )
  console.log(`Wheel output: ${wheelInstall.stdout}, ${wheelInstall.stderr}`)
  if (wheelInstall.exitCode !== 0) {
    core.setFailed(
      `Error installing wheel: ${wheelInstall.stdout}, ${wheelInstall.stderr}`
    )
  }

  let html5validator_version = core.getInput('validator_version')
  if (html5validator_version !== '') {
    html5validator_version = `==${html5validator_version}`
  }
  core.startGroup('Installing HTML5Validator')

  const install = await exec.getExecOutput(
    'pip3',
    [
      'install',
      '--disable-pip-version-check',
      '--no-cache-dir',
      `html5validator${html5validator_version}`
    ],
    {ignoreReturnCode: true}
  )
  if (install.exitCode !== 0) {
    core.setFailed(
      `Error installing html5validator: ${install.stdout}, ${install.stderr}`
    )
    return
  }
  core.endGroup()
  const config: Config = await generateConfig()
  const runArgs: string[] = []
  if (config.css) {
    runArgs.push('--also-check-css')
  }
  if (config.format !== '') {
    runArgs.push(`--format ${config.format}`)
  }
  if (config.blacklist.length !== 0) {
    runArgs.push(`--blacklist ${config.blacklist.join(' ')}`)
  }
  runArgs.push(`--log ${config.log_level}`)
  runArgs.concat(config.extra)
  let results: exec.ExecOutput
  if (config.config !== '') {
    results = await exec.getExecOutput(
      'html5validator',
      [`--config ${config.config}`],
      {
        ignoreReturnCode: true
      }
    )
  } else {
    results = await exec.getExecOutput(
      'html5validator',
      [...runArgs, `--root ${config.root}`],
      {
        ignoreReturnCode: true
      }
    )
  }
  core.setOutput('results', results.exitCode)
  if (results.exitCode !== 0) {
    core.setFailed('html5validator returned non-zero exit code')
  }
}

run()
