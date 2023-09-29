import Hall from "./Hall";
import Movie from "./Movie";

export default interface Showtime {
    id: number;
    movie: Movie;
    hall: Hall;
    startTime: Date;
    endTime: Date;
}