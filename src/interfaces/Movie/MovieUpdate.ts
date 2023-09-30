import { GenreKeys } from "../Genre";
import { LanguageKeys } from "../Language";

export default interface MovieUpdate {
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: GenreKeys;
    director: string;
    language: LanguageKeys;
    minAge: number;
}