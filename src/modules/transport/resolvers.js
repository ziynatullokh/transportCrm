import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { GraphQLUpload } from 'graphql-upload'
import { finished } from 'stream/promises'
import { USER_CONFIG } from '#config/index'
import db from './model.js'
import fs from 'fs'
import path from 'path'



export default {
    Upload: GraphQLUpload,

    Model: {
        "Nexia" : 1,
        "Damas" : 2,
        "Nexia_2"  : 3,
        "Nexia_3"  : 4,
        "Gentra" : 5,
        "Captiva" : 6,
        "Tiko" : 7,
        "Matiz" : 8,
        "Lacetti" : 9,
        "Cobalt" : 10
    },
    Color: {
        "Oq":1,
        "Qora":2,
        "Qizil":3,
        "Kulrang":4,
        "Sariq":5
    },
    Mutation:{
        addTransport: async( _, { branch, model, color, file }, { checkToken, token }) => {
            const client = checkToken(token)
            
            const response = await db.checkPermission({ user_id: client, modul: 'transports' })
            
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
            
            if(!response.user_create) throw new ForbiddenError("this User is not allowed(transport_create)")
            
            const checkBranch = await db.checkBranch({ user_id: client })

            if(!checkBranch || checkBranch.branch_name != branch && client != 1) throw new ForbiddenError("this User is not allowed(in this branch add)")

            const { createReadStream, filename, mimetype } = await file
            
            if (!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) {
                throw new UserInputError("File mime type not allowed")
            }

            const fileName = Date.now() + filename.replace(/\s/g, '')
            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName))
            createReadStream().pipe(out)
            await finished(out)

            const car = await db.addTransport({ staff: client, branch: checkBranch.branch_id, model, color, fileName })
            
            if(!car?.transport_id) throw new Error("Neojidinni oshibka")

            const res = await db.getTransport({ transport_id: car.transport_id})
            return {
                status: 201,
                success: true,
                message:"The car successfully added",
                data: JSON.stringify(res)
            }
        },

        changeTransport: async( _, { transport_id ,branch, color, file }, { checkToken, token }) => {
            const client = checkToken(token)
            
            const response = await db.checkPermission({ user_id: client, modul: 'transports' })
            
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
            
            if(!response.user_update) throw new ForbiddenError("this User is not allowed(transport_update)")
            
            const car = await db.getTransport({ transport_id })

            if(!car) throw new UserInputError("Car not found")

            const checkBranch = await db.checkBranch({ user_id: client })
            
            if(!checkBranch || (checkBranch.branch_name != car.branch && client != 1)) throw new ForbiddenError("this User is not allowed(in this branch update)")
            
            const checkBranchAdress = await db.checkBranchAdress({branch})
            
            if(!checkBranchAdress) throw new UserInputError('Branch not found')
            const { createReadStream, filename, mimetype } = file ? await file : {}
            
            
            if (!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype) && file) {
                throw new UserInputError("File mime type not allowed")
            }
            
            const fileName = filename ? Date.now() + filename.replace(/\s/g, '') : null
            const out = filename ? fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName)) : null
            filename ? createReadStream().pipe(out) : null
            filename ? await finished(out) : null

            let chengedCar = await db.changeCar({ transport_id , branch: checkBranchAdress.branch_id, color, fileName })

            
            return {
                status: 200,
                success: true,
                message:"The car successfully changed",
                data: JSON.stringify(chengedCar)
            }
        },

        deleteTransport: async (_, { transport_id } , { checkToken, token }) => {
            const client = checkToken(token)
            
            const response = await db.checkPermission({ user_id: client, modul: 'transports' })
            
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
            
            if(!response.user_delete) throw new ForbiddenError("this User is not allowed(transport_delete)")
            
            const car = await db.getTransport({ transport_id })

            if(!car) throw new UserInputError("Car not found")

            const checkBranch = await db.checkBranch({ user_id: client })
            
            if(!checkBranch || (checkBranch.branch_name != car.branch && client != 1)) throw new ForbiddenError("this User is not allowed(in this branch delete)")

            const deleteTransport = await db.deleteTransport({ transport_id })

            return {
                status: 200,
                success: true,
                message:"The transport successfully deleted",
                data: JSON.stringify(deleteTransport)
            }
        }
    },

    Query: {
        transports: async (_, { pagination, search, sort }, { checkToken, token }) => {
            const client = await checkToken(token)
            const checkBranch = await db.checkBranch({ user_id: client })

            let response = await db.checkPermission({ user_id: client, modul: 'transports' })
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
        

            if(checkBranch.branch_id == 1 || client == 1 || response.user_read) {
                const sortKey = Object.keys(sort || {})[0]

                let data = await db.getAllTransport({
                    page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                    limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                    sortValue: sort ? sort[sortKey] : null,
                    sortKey,
                    search
                })

                return {
                    status: 200,
                    success: true,
                    message:"All transports data",
                    data: [data]
                }
            }

            const sortKey = Object.keys(sort || {})[0]
            
            let staffTransports = await db.staffTransports({ 
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search, 
                branch_id: checkBranch.branch_id

            })

            if(!staffTransports) throw new Error("The branches not exists transport")

            return {
                status: 200,
                success: true,
                message:"All  branch transports",
                data: staffTransports
            }
            
        }
    }

}