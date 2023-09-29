export const languageMap = new Map<string, string>([
    ["HEBREW", "עברית"],
    ["ENGLISH", "אנגלית"],
    ["RUSSIAN", "רוסית"],
]);
export const getLanguageKeyByValue = (searchValue: string | undefined): string => {
    const entries = languageMap.entries();
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
export type LanguageKeys = ReturnType<typeof languageMap.keys.toString>;
export type LanguageValues = ReturnType<typeof languageMap.values.toString>;
