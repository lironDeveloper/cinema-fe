export default interface Branch {
    id: number;
    title: string;
    description: string;
    duration: string;
    releaseDate: string;
    genre: "COMEDY" | "HORROR" | "DRAMA" | "KIDS" | "ACTION";
    director: string;
    language: "HEBREW" | "ENGLISH" | "RUSSIAN";
    minAge: number;
}