import Hall from "../Hall/Hall";
import Movie from "../Movie/Movie";

export default interface Showtime {
    id: number;
    movie: Movie;
    hall: Hall;
    startTime: Date;
    endTime: Date;
}