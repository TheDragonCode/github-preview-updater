import { hasComposer, hasNpm, hasYarn } from '../../src/utils/packageManagers'

test('composer', () => {
    expect(hasComposer(process.cwd())).toBe(false)
})

test('npm', () => {
    expect(hasNpm(process.cwd())).toBe(true)
})

test('yarn', () => {
    expect(hasYarn(process.cwd())).toBe(false)
})
