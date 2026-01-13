import { testConfig } from '../helpers/config'
import { Config, defaultConfig } from '../../src/types/config'
import { readConfig } from '../../src/utils/filesystem'
import { CONFIG_PATH } from '../../src/utils/inputs'

test('read config', () => {
    const data: Config = readConfig(testConfig, CONFIG_PATH.defaultValue, testConfig)

    expect(data.directory).toBe(testConfig.directory)
    expect(data.image.parameters.packageName).toBe(testConfig.image.parameters.packageName)
    expect(data.image.parameters.title).toBe(testConfig.image.parameters.title)
    expect(data.image.parameters.description).toBe(testConfig.image.parameters.description)

    expect(data.path.readme).toBe(defaultConfig.path.readme)
    expect(data.image.url).toBe(defaultConfig.image.url)
    expect(data.image.parameters.pattern).toBe(defaultConfig.image.parameters.pattern)

    expect(data.image.parameters.packageManager).toBe('none')
    expect(data.image.parameters.icon).toBe('photograph')
})
