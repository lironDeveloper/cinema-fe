import { ReactNode } from "react";
import { GenreValues } from "../Genre";
import { LanguageValues } from "../Language";

export default interface MovieRow {
    id: number;
    title: string;
    description: string;
    duration: string;
    releaseDate: string;
    genre: GenreValues | undefined;
    director: string;
    language: LanguageValues | undefined;
    minAge: number;
    thumbnail: ReactNode;
}