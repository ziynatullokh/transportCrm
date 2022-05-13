import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { GraphQLUpload } from 'graphql-upload'
import { finished } from 'stream/promises'
import { USER_CONFIG } from '#config/index'
import db from './model.js'
import jwt from '#utils/jwt'



export default {
   
    Mutation:{
        addBranch: async( _, { branchname, address }, { checkToken, token }) => {
            const client = checkToken(token)
            
            const response = await db.checkPermission({ user_id: client, modul: 'branch' })
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
            if(!response.user_create) throw new ForbiddenError("this User is not allowed(branch_create)")
            
            const findBrench = await db.checkBranchAdress({ branch: branchname })
            if(findBrench) throw new Error("Takoy brench already exists")

            const branch = await db.addBranch({ branchname, address })
            if(!branch?.branch_id) throw new Error("Neojidinni oshibka")
            
            return {
                status: 201,
                success: true,
                message:"The branch successfully added",
                data: JSON.stringify(branch)
            }
        },

        changeBranch: async( _, { branch_id, branchname, address }, { checkToken, token }) => {
            const client = checkToken(token)
            
            const response = await db.checkPermission({ user_id: client, modul: 'branch' })
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
            if(!response.user_update) throw new ForbiddenError("this User is not allowed(branch_update)")
            
            let chengedBranch = await db.changeBranch({ branch_id, branchname, address})
            return {
                status: 200,
                success: true,
                message:"The branch successfully changed",
                data: JSON.stringify(chengedBranch)
            }
        },

        deleteBranch: async (_, { branch_id } , { checkToken, token, clientAgent, clientIP }) => {
            const client = checkToken(token)
            
            const response = await db.checkPermission({ user_id: client, modul: 'branch' })
            
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
            
            if(!response.user_delete) throw new ForbiddenError("this User is not allowed(branch_delete)")
            
            const deleteBranch = await db.deleteBranch({ branch_id })
            // const dbremovetoken = jwt.sign({ branch_id, userAgent: clientAgent, userIP: clientIP })
            return {
                status: 200,
                success: true,
                message:"Branch deleted",
                data: JSON.stringify(deleteBranch)
            }
        }
    },

    Query: {
        branches: async (_, __, { checkToken, token }) => {
            const client = await checkToken(token)
            const checkBranch = await db.checkBranch({ user_id: client })

            let response = await db.checkPermission({ user_id: client, modul: 'transports' })
            if(!response) throw new ForbiddenError("the token owner has already been deleted")
        

            if(response.user_read){
                let branches = await db.getAllBranch({})
                return {
                    status: 200,
                    success: true,
                    message:"All  branchs",
                    data: branches
                }
            }

            let result = await db.getAllBranch({ branch_id: checkBranch.branch_id, branchname: checkBranch.branch_name})

            if(!result) throw new Error("The worker has no branch")

            return {
                status: 200,
                success: true,
                message:"Employee branch ",
                data: result
            }
            
        }
    }

}