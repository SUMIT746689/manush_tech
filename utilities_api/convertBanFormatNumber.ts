export const handleConvBanNum = (value: string): { number: string | null, err: string | null } => {
    if (value.length !== 11 && value.length !== 13) return { number: null, err: 'provide a valid number' }
    if (value.length === 11) {
        const pattern = /^01/;
        if (!pattern.test(value)) return { number: null, err: '11 character number must be start with 01' }
        return { number: '88' + value, err: null }
    }
    const pattern = /^8801/;
    if (!pattern.test(value)) return { number: null, err: '13 character number must be start with 8801' }
    return { number: value, err: null }
} 
