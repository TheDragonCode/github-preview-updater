export const randomizer = (length: number = 8) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";

    let result: string = "";

    for (let i: number = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};
