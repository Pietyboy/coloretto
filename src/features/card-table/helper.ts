export const getOffsetMap = (offset: number, count: number) => {
    const result = [];

    for( let i = 0; i < count; i++){
        result.push(i * offset);
    }

    return result
}