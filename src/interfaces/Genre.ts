export const genresMap = new Map<string, string>([
    ["COMEDY", "קומדיה"],
    ["HORROR", "אימה"],
    ["DRAMA", "דרמה"],
    ["KIDS", "ילדים"],
    ["ACTION", "אקשן"],
]);
export const getGenreKeyByValue = (searchValue: string | undefined): string => {
    const entries = genresMap.entries();
    let result = entries.next();
    while (!result.done) {
        const [key, value] = result.value;
        if (value === searchValue) {
            return key;
        }
        result = entries.next();
    }
    return "לא מוכר";
};
export type GenreKeys = ReturnType<typeof genresMap.keys.toString>;
export type GenreValues = ReturnType<typeof genresMap.values.toString>;
