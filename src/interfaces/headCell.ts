import Adminable from "./Adminable";
import TableRowDisplay from "./TableRowDisplay";

export default interface HeadCell<T extends TableRowDisplay> {
    id: keyof T;
    label: string;
}