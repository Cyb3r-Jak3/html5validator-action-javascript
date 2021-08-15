import * as os from 'os'
import * as config from '../src/config'

describe('Config', () => {
  it('good config', async () => {
    setInput('root', '.')
    setInput('log_level', 'DEBUG')
    setInput('format', 'json')
    setInput('css', 'true')
    const test_config = await config.generateConfig()
    expect(test_config.root).toEqual('.')
    expect(test_config.log_level).toEqual('DEBUG')
    expect(test_config.css).toEqual(true)
    expect(test_config.format).toEqual('json')
  })
  it('bad format', async () => {
    process.stdout.write = jest.fn()
    setInput('format', 'bad')
    await config.generateConfig()
    assertWriteCalls([`::warning::Unsupported format output: bad${os.EOL}`])
  })
  it('blacklist', async () => {
    setInput('blacklist', 'index\nindex2')
    const test_config = await config.generateConfig()
    console.log(test_config)
    expect(test_config.blacklist.length).toEqual(2)
    expect(test_config.blacklist[0]).toEqual('index')
    expect(test_config.blacklist[1]).toEqual('index2')
  })
})

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
