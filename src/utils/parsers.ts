export const splitCsv = (values: string) => {
    return values
        .split(',')
        .map((value: string) => value.trim())
        .filter((value: string) => value !== '')
}
