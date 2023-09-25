export const genresMap = new Map<string, string>([
    ["COMEDY", "קומדיה"],
    ["HORROR", "אימה"],
    ["DRAMA", "דרמה"],
    ["KIDS", "ילדים"],
    ["ACTION", "אקשן"],
]);
export const getGenreKeyByValue = (searchValue: string | undefined): string => {
    for (const [key, value] of genresMap.entries()) {
        if (value === searchValue) {
            return key;
        }
    }
    return "לא מוכר";
};
export type GenreKeys = ReturnType<typeof genresMap.keys.toString>;
export type GenreValues = ReturnType<typeof genresMap.values.toString>;
