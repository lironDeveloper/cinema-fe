export const languageMap = new Map<string, string>([
    ["HEBREW", "עברית"],
    ["ENGLISH", "אנגלית"],
    ["RUSSIAN", "רוסית"],
]);
export const getLanguageKeyByValue = (searchValue: string | undefined): string => {
    for (const [key, value] of languageMap.entries()) {
        if (value === searchValue) {
            return key;
        }
    }
    return "לא מוכר";
};
export type LanguageKeys = ReturnType<typeof languageMap.keys.toString>;
export type LanguageValues = ReturnType<typeof languageMap.values.toString>;
