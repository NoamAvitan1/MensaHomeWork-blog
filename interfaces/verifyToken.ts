import { JwtPayload } from "jsonwebtoken";

export interface VerifyToken extends JwtPayload {
    _id: string;
    role: string;
}