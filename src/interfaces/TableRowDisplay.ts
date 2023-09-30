import BranchRow from "./Branch/BranchRow";
import HallRow from "./Hall/HallRow";
import MovieRow from "./Movie/MovieRow";
import ShowtimeRow from "./Showtime/ShowtimeRow";
import UserRow from "./User/UserRow";


type TableRowDisplay = MovieRow | HallRow | BranchRow | ShowtimeRow | UserRow;
export default TableRowDisplay;