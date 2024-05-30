export const handleConvBanNum = (value: string): { number: string | null, err: string | null } => {
    const valueLength = value.length;
    console.log({ valueLength })
    if (valueLength !== 10 && valueLength !== 11 && valueLength !== 13) return { number: null, err: 'provide a valid number' }
    if (valueLength === 10) {
        const pattern = /^1/;
        if (!pattern.test(value)) return { number: null, err: '10 character number must be start with 1' }
        return { number: '880' + value, err: null }
    }
    if (value.length === 11) {
        const pattern = /^01/;
        if (!pattern.test(value)) return { number: null, err: '11 character number must be start with 01' }
        return { number: '88' + value, err: null }
    }
    const pattern = /^8801/;
    if (!pattern.test(value)) return { number: null, err: '13 character number must be start with 8801' }
    return { number: value, err: null }
} 
