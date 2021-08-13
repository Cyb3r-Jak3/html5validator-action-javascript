import * as core from '@actions/core'
import * as exec from '@actions/exec'

export async function run(): Promise<void> {
  core.startGroup('Installing HTML5Validator')
  await exec.exec('pip', [
    'install',
    '-disable-pip-version-check',
    '--no-cache-dir ',
    '--upgrade',
    'html5validator'
  ])
  core.endGroup()
}

run()
