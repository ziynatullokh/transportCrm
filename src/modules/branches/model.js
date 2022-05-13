import query from './sql.js'
import db from '#pg'

async function checkPermission({user_id, modul}){
    const [response] = await db(query.CHECK_PERMISSION, user_id, modul)
    return response
}

async function checkBranch( { user_id } ){
    const [response] = await db(query.CHECK_BRANCH, user_id)
    return response
}

async function checkBranchAdress( { branch } ){
    const [response] = await db(query.CHECK_BRANCH_ADRESS, branch)
    return response
}

async function addBranch({ branchname, address }){
    const [response] = await db( query.ADD_BRANCH, branchname, address )
    return response
}

async function getTransport( {transport_id = null }){
    const [response] = await db( query.GET_TRANSPORT,  transport_id)
    response ? response.transport_img= "http://" + process.env.serverIP + ':' + process.env.PORT +'/' + response?.transport_img : false
    return response
    
}

async function changeBranch({ branch_id, branchname, address }){
    
    let resultID = 0

    branchname ? resultID = (await db(query.CHANGE_BRANCH_NAME, branch_id ,branchname))[0]?.['branch_id'] : false
    address ? resultID = (await db(query.CHANGE_BRANCH_ADDRESS, branch_id ,address))[0]?.['branch_id'] : false
    
    if(!resultID) throw new Error("Branch not found")
    
    const [response] = await db(query.GET_BRANCH, resultID)
    return response
}

async function deleteBranch( { branch_id } ){
    const [response] = await db( query.DELETE_BRANCH, branch_id )
    if(!response) throw new Error("Branch not found")
    return response
}


async function getAllTransport({ page, limit, search, sortKey, sortValue }) {
    const [response] = await db( 
        query.GET_TRANSPORT_ALL,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
        )
    
    return response
}

async function staffTransports({ page, limit, search, sortKey, sortValue, branch_id }){
    const response = await db(query.STAFF_TRANSPORTS,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue,
        branch_id
        )
    console.log(response)
    return response
}

async function getAllBranch({ branch_id, branchname }){
    if(branch_id || branchname){
        let response = await db(query.GET_ALL_BRANCH_USER, branch_id || branchname)
        return response
    }
    let response = await db(query.GET_ALL_BRANCH)
    console.log(response)
    return response
}

export default {
    getAllBranch,
    staffTransports,
    getAllTransport,
    deleteBranch,
    checkBranchAdress,
    changeBranch,
    getTransport,
    addBranch,
    checkPermission,
    checkBranch
}