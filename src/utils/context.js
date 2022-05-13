import { ForbiddenError, AuthenticationError } from 'apollo-server-express'
import jwt from '#utils/jwt'

export default ({req,res}) => {
    const clientAgent = req.headers['user-agent']
    const clientIP = req.ip
    const token = req.headers['token']
    const checkToken = (token) => {
        if(!token) throw new AuthenticationError("Token not found")

        const verifyToken = jwt.verify(token)

        if(clientAgent != verifyToken.userAgent || clientIP != verifyToken.userIP) throw new ForbiddenError("The device is not verified")
        
        return verifyToken.userid
    }

    return {
        token,
        checkToken,
        clientAgent,
        clientIP
    }
}