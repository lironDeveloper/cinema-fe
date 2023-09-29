import Movie from "./Movie";
import Branch from "./Branch";
import Hall from "./Hall";
import Showtime from "./Showtime";

type Adminable = Movie | Hall | Branch | Showtime;
export default Adminable;