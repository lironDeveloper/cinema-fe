import { GenreKeys } from "../Genre";
import { LanguageKeys } from "../Language";

export default interface MovieCreation {
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: GenreKeys;
    director: string;
    language: LanguageKeys;
    minAge: number;
}