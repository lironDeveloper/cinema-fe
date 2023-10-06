import Branch from "../Branch/Branch";

export default interface Hall {
    id: number;
    name: string;
    numOfRows: number;
    numOfColumns: number;
    branch: Branch;
}