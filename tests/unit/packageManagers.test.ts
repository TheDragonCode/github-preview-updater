import { hasComposer, hasNpm, hasYarn } from '../../src/utils/packageManagers'
import { Config, defaultConfig } from '../../src/types/config'

const testConfig: Config = {
    directory: process.cwd(),
    image: { url: '' }
}

test('composer', () => {
    expect(hasComposer(testConfig)).toBe(false)
})

test('npm', () => {
    expect(hasNpm(testConfig)).toBe(true)
})

test('yarn', () => {
    expect(hasYarn(testConfig)).toBe(false)
})
