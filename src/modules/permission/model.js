import query from './sql.js'
import db from '#pg'

async function checkPermission({user_id, modul}){
    const [response] = await db(query.CHECK_PERMISSION, user_id, modul)
    return response
}

async function updatePermission({user_id, module, permission,key}){
    switch(permission){
        case 'user_create':{
            const [response] = await db(query.CREATE_PERMISSION, user_id, module, key)
            return response
        }
        case 'user_update':{
            const [response] = await db(query.UPDATE_PERMISSION, user_id, module, key)
            return response
        }
        case 'user_delete':{
            const [response] = await db(query.DELETE_PERMISSION, user_id, module, key)
            return response
        }
        case 'user_read':{
            const [response] = await db(query.READ_PERMISSION, user_id, module, key)
            return response
        }
        default:{
            throw new Error("Permission not found")
        }

    }
}

async function ownPermission( { user_id } ){
    const response = user_id ? await db(query.OWN_PERMISSION, user_id) : await db(query.ALL_PERMISSION)
    
    return response
}



export default {
    ownPermission,
    checkPermission,
    updatePermission
}