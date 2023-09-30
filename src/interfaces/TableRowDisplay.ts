import BranchRow from "./BranchRow";
import HallRow from "./HallRow";
import MovieRow from "./MovieRow";
import ShowtimeRow from "./ShowtimeRow";
import UserRow from "./UserRow";


type TableRowDisplay = MovieRow | HallRow | BranchRow | ShowtimeRow | UserRow;
export default TableRowDisplay;