export function lengthBetween(low: number, hi: number) {
    return (k: string) => k.length >= low && k.length <= hi;
}

export function notEmpty(k: string) {
    return lengthBetween(1, Infinity)(k);
}

export function isEmail(k: string) {
    return !!k.match(/^(?:www\.)?\w+(?:.\w)*@\w+\.[a-z]{2,}$/g);
}

export function containDigits(k: string) {
    return !!k.match(/[0-9]/g);
}

export function containCapitalLetters(k: string) {
    return !!k.match(/[A-Z]/g);
}

export function containNonCapitalLetters(k: string) {
    return !!k.match(/[a-z]/g);
}

export function containSpecialCharacters(k: string) {
    return !!k.match(/[*&^%$#@!~_+=-]/g);
}