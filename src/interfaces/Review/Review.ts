import Movie from "../Movie/Movie";
import User from "../User/User";

export default interface Review {
    id: number;
    user: User;
    movie: Movie;
    rating: number;
    comment: string;
}