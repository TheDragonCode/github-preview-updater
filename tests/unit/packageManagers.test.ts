import { hasComposer, hasNpm, hasYarn } from '../../src/utils/packageManagers'

test('composer', () => {
    expect(hasComposer()).toBe(true)
})

test('npm', () => {
    expect(hasNpm()).toBe(true)
})

test('yarn', () => {
    expect(hasYarn()).toBe(false)
})
