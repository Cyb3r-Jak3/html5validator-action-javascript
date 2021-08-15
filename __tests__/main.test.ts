import * as os from 'os'
import {run} from '../src/main'

describe('Main', () => {
    it('no root or config', async () => {
      process.stdout.write = jest.fn()
      await run()
      assertWriteCalls([`::error::Need either root or config set${os.EOL}`])
    });
  it('custom validator version', async () => {
    jest.setTimeout(10000000);
    generateNewConfig()
    setInput('validator_version', '0.4.0')
    await run()
  })
})

function generateNewConfig(): void {
  setInput('root', '~/tests/valid/')
  setInput('log_level', 'DEBUG')
  setInput('format', 'json')
  setInput('css', 'true')
}

// See: https://github.com/actions/toolkit/blob/a1b068ec31a042ff1e10a522d8fdf0b8869d53ca/packages/core/src/core.ts#L89
function getInputName(name: string): string {
  return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
}

function setInput(name: string, value: string): void {
  process.env[getInputName(name)] = value
}

// Assert that process.stdout.write calls called only with the given arguments.
function assertWriteCalls(calls: string[]): void {
  expect(process.stdout.write).toHaveBeenCalledTimes(calls.length)
  for (let i = 0; i < calls.length; i++) {
    expect(process.stdout.write).toHaveBeenNthCalledWith(i + 1, calls[i])
  }
}
