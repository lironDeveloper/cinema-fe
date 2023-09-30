import Movie from "./Movie/Movie";
import Branch from "./Branch/Branch";
import Hall from "./Hall/Hall";
import Showtime from "./Showtime/Showtime";

type Adminable = Movie | Hall | Branch | Showtime;
export default Adminable;