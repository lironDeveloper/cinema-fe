import Hall from "../Hall/Hall";
import Movie from "../Movie/Movie";
import Point from "../Point";
import Seat from "../Seat/Seat";
import Showtime from "../Showtime/Showtime";
import User from "../User/User";

export interface Ticket {
    id: number;
    user: User;
    showtime: Showtime;
    seat: Seat;
}