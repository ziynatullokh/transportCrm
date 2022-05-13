import query from './sql.js'
import db from '#pg'

async function getUsers({ page, limit, search, sortKey, sortValue }) {

    return await db(
        query.GET_USERS,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
    )
}

async function getUser({ user_id }) {
    const [user] = await db(query.GET_USER, user_id)
    
    return user
}

async function createUser({ username, password, birthdate, gender, branch }){
    const [response] = await db(query.CREATE_USER,username, password, birthdate, gender, branch)
    return response
}

async function checkBranch(branch_name){
    const [response] = await db(query.CHECK_BRANCH, branch_name)
    return response
}

async function findUser(username){
    const [response] = await db(query.FIND_USER, username)
    return response
}


async function defaultPermission1({user_id}) {
    const [response] = await db(query.DEFAULT_PERMISSION1, user_id)
    return response
}

async function checkPermission({user_id, modul}){
    const [response] = await db(query.CHECK_PERMISSION, user_id, modul)
    return response
}

export default {
    defaultPermission1,
    checkPermission,
    findUser,
    checkBranch,
    createUser,
    getUsers,
    getUser
}