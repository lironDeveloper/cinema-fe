import { Role } from "../Role";

export default interface User {
    id: number;
    fullName: string;
    email: string;
    role: Role;
}