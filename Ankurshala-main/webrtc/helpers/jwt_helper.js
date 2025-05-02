const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./init_redis')
const User = require('../Models/User.model')
const Role = require('../Models/Role.model')
const mongoose = require('mongoose')


const permissionUrls = [
  // Role Permissions
  {
    path: '/role/create',
    permission: ['role', 'create']
  },
  {
    path: '/role/getList',
    permission: ['role', 'list']
  },
  {
    path: '/role/updateById',
    permission: ['role', 'edit']
  },
  {
    path: '/role/updateById',
    permission: ['role', 'permission']
  },
  {
    path: '/role/deleteDataById',
    permission: ['role', 'delete']
  },
  // User Permissions
  {
    path: '/user/create',
    permission: ['user', 'create']
  },
  {
    path: '/auth/getUsersList',
    permission: ['user', 'list']
  },
  {
    path: '/user/updateById',
    permission: ['user', 'edit']
  },
  {
    path: '/user/deleteDataById',
    permission: ['user', 'delete']
  },
 
  // Member Permissions
  {
    path: '/member/create',
    permission: ['member', 'create']
  },
  {
    path: '/member/getList',
    permission: ['member', 'list']
  },
  {
    path: '/member/updateById',
    permission: ['member', 'edit']
  },
  {
    path: '/member/deleteDataById',
    permission: ['member', 'delete']
  },
  
];

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: '1d',
        issuer: 'pickurpage.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload.aud) })
      const role = await Role.findOne({ _id: new mongoose.Types.ObjectId(user.role) })
      req.user = user
      req.role = role
      const permissionData = permissionUrls.filter(o => o.path === req.originalUrl).pop()
      // if (permissionData && !(req.role.permission[permissionData.permission[0]][permissionData.permission[1]])) {
      //   const message = 'Unauthorized'
      //   return next(createError.Unauthorized(message))
      // }
      req.payload = payload
      next()
    })
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: '1y',
        issuer: 'pickurpage.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          // reject(err)
          reject(createError.InternalServerError())
        }

        client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.log(err.message)
            reject(createError.InternalServerError())
            return
          }
          resolve(token)
        })
      })
    })
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized())
          const userId = payload.aud
          client.GET(userId, (err, result) => {
            if (err) {
              console.log(err.message)
              reject(createError.InternalServerError())
              return
            }
            if (refreshToken === result) return resolve(userId)
            reject(createError.Unauthorized())
          })
        }
      )
    })
  },
}
