export function formatNumberToLocale(num: number, isBrazil=false) {
    return isBrazil
        ? new Intl.NumberFormat('pt-BR').format(num)
        : new Intl.NumberFormat('en-US').format(num);
}