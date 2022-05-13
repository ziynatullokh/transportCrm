import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { USER_CONFIG } from '#config/index'
import model from './model.js'



export default {
    Query: {
        ownPermissions: async(_, __,{ checkToken, token }) => {
            const client = checkToken(token)
            
            let response = await model.ownPermission({ user_id: client })

            if(!response.length) throw new ForbiddenError("the token owner has already been deleted")

            return {
                status: 200,
                success: true,
                message: "The user all permissions",
                data: response
            }
        },
        allPermissions: async(_, { user_id },{ checkToken, token }) => {
            const client = checkToken(token)
            
            let response = await model.checkPermission({ user_id: client, modul: 'permission' })
            

            if(!response) throw new ForbiddenError("the token owner has already been deleted")

            if(!response.user_read && client != 1) throw new ForbiddenError("this User is not allowed(permission_read)")

            let data = await model.ownPermission({ user_id })

            if(!data?.length) throw new UserInputError("This user not found")

            return {
                status: 200,
                success: true,
                message: "The user all permissions",
                data: data
            }
        }
    },
    Modul: {
        "Transport": "transports",
        "Branch": "branch",
        "Permission": "permission"
    },
    
    Permission: {
        "Create": "user_create",
        "Read": "user_read",
        "Delete": "user_delete",
        "Update": "user_update"
    },

    Mutation: {
        addPermission: async (_, { user_id, branch, module, permission  }, { checkToken, token }) => {

            const client = checkToken(token)
            
            let response = await model.checkPermission({ user_id: client, modul: 'permission' })

            if(!response) throw new ForbiddenError("the token owner has already been deleted")

            if(!response.user_update && client != 1) throw new ForbiddenError("this User is not allowed(permission_add)")

            const change = await model.updatePermission({user_id, module, permission,key:true })
            if (!change) throw new UserInputError("This user not found")
            return{
                status: 200,
                success: true,
                message: "Module " + module + " permission " + permission + ' ' + "added",
                data:JSON.stringify(change)
            }
        },
        deletePermission: async (_, { user_id, module, permission  }, { checkToken, token }) => {

            const client = checkToken(token)
            
            let response = await model.checkPermission({ user_id: client, modul: 'permission' })

            if(!response) throw new ForbiddenError("the token owner has already been deleted")

            if(!response.user_delete && client != 1) throw new ForbiddenError("this User is not allowed(permission_delete)")

            const change = await model.updatePermission({user_id, module, permission, key:false })
            return{
                status: 200,
                success: true,
                message: "Module " + module + " permission " + permission + ' ' + "deleted",
                data:JSON.stringify(change)
            }
        },
        
    },

}