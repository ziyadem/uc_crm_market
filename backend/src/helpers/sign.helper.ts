import { JWT_EXPIRE_ACCESS, JWT_EXPIRE_REFRESH } from '../constants'
import * as jwt from 'jsonwebtoken'

export const sign = (payload: object): string =>
  jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: JWT_EXPIRE_ACCESS,
  })

export const refreshSign = (payload: object): string =>
  jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: JWT_EXPIRE_REFRESH,
  })
