import jwt from 'jsonwebtoken' 
import { PayloadToken } from '../interfaces/payloadToken'


export const generateToken = (payload:PayloadToken, expires:string) => {
    return jwt.sign(payload, 'Noam159753852',{expiresIn:expires})
}