import Rowable from "./Rowable";

export default interface HeadCell<T extends Rowable> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
}