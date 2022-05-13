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

async function addTransport({ staff,branch, model, color, fileName }){
    const [response] = await db( query.ADD_TRANSPORT, staff,branch, model, color, fileName )
    return response
}

async function getTransport( {transport_id = null }){
    const [response] = await db( query.GET_TRANSPORT,  transport_id)
    response ? response.transport_img= "http://" + process.env.serverIP + ':' + process.env.PORT +'/' + response?.transport_img : false
    return response
    
}

async function changeCar({ transport_id ,branch, color, fileName }){
    let resultID = 0
    
    branch ? resultID = (await db(query.CHANGE_CAR_BRANCH, transport_id ,branch))[0]['transport_id'] : false
    color ? resultID = (await db(query.CHANGE_CAR_COLOR, transport_id ,color))[0]['transport_id'] : false
    fileName ? resultID = (await db(query.CHANGE_CAR_IMG, transport_id ,fileName))[0]['transport_id'] : false
    
    const [response] = await db(query.GET_TRANSPORT, resultID)
    response.transport_img= "http://" + process.env.serverIP + ':' + process.env.PORT +'/' + response?.transport_img
    return response
}

async function deleteTransport( { transport_id } ){
    const [response] = await db( query.DELETE_TRANSPORT, transport_id )
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
export default {
    staffTransports,
    getAllTransport,
    deleteTransport,
    checkBranchAdress,
    changeCar,
    getTransport,
    addTransport,
    checkPermission,
    checkBranch
}