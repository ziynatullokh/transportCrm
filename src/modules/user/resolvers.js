import { UserInputError, AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { USER_CONFIG } from '#config/index'
import model from './model.js'
import jwt from '#utils/jwt'
import md5 from 'md5'

export default {
    staffRespons: {
        birthdate: (response) => response.birthdate.toString().split(' ')[1] + '-' +response.birthdate.toString().split(' ')[2] + '-' + response.birthdate.toString().split(' ')[3],
        registertime: (response) => response.registertime.toString().split(' ')[1] + '-' + response.registertime.toString().split(' ')[2] + '-' + response.registertime.toString().split(' ')[3]
    },

    Transport:{
        transport_img: (response) => "http://" + process.env.serverIP + ':' + process.env.PORT + '/' + response.transport_img 
    },

    Query: {
        staffs: async (_, { pagination, search, sort }, { checkToken, token }) => {
            const client = checkToken(token)
            
            let response = await model.checkPermission({ user_id: client, modul: 'permission' })
            if(!response) throw new ForbiddenError("the token owner has already been deleted")

            const getUser = await model.getUser({ user_id: client })
            
            if(!getUser) throw new Error("Neojidnni oshibka user resolvers")

            if(!response.user_read && client != 1) {
                return {
                    status: 200,
                    success: true,
                    message:"This user data",
                    data: [getUser]
                }
            }

            const sortKey = Object.keys(sort || {})[0]
            
            let data = await model.getUsers({ 
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
             })

            if(!data?.length) throw new UserInputError("users not found")
            
            return {
                status: 200,
                success: true,
                message: "All users data",
                data: data
            }
        }
    },

    Gender:{
        'Erkak':1,
        'Ayol':2
    },

    Mutation: {
        login: async (_, { username, password }, {clientAgent, clientIP}) => {

            const response = await model.findUser(username)
            
            if(!response) throw new UserInputError("no such user was found")

            if(response.user_password != md5(password)) throw new UserInputError("Wrong password")

            const token = jwt.sign({ userid: response.user_id, userAgent:clientAgent, userIP:clientIP})

            return {
                status:202,
                success:true,
                message:"successfully logged in",
                data: JSON.stringify({token})
            }
        },

        register: async (_, { username, password, repeat_password, birthdate, gender,branch }, { clientAgent, clientIP }) => {
            
            username = username?.trim()
            password = password?.trim() 
            repeat_password = repeat_password?.trim()
            birthdate = birthdate?.trim()
            branch = branch?.trim()
            const checkBirthdate = birthdate?.split('-')
            if(!username || !password || !repeat_password || !birthdate || !branch) {
                throw new UserInputError('The user register required username, password, repeat_password, birtdate, branch')
            }
            
            if( !(+checkBirthdate[0]) || checkBirthdate[0] < 1970 ) throw new UserInputError("year of birth must be older than 1970")
            if( !(+checkBirthdate[0]) || checkBirthdate[0] > 2020 ) throw new UserInputError("year of birth should be less than 2020")
            if( !(+checkBirthdate[1]) || checkBirthdate[1] > 12 || checkBirthdate[1] < 1) throw new UserInputError("The month of birth was entered incorrectly")
            if( !(+checkBirthdate[2]) || checkBirthdate[2] > 31 || checkBirthdate[2] < 1) throw new UserInputError("The Birthday entered incorrectly ")
            
            if(username.length < 5) throw new UserInputError("Username length require minimum 5")
            if(username.length > 50) throw new UserInputError("Username length require maximum 50")

            if(password != repeat_password) throw new UserInputError("enter the same password in the password")
            
            const findUser = await model.findUser(username)

            if(findUser) throw new UserInputError("This username already exists")

            const checkBranch = await model.checkBranch(branch)
            
            if(!checkBranch) throw new UserInputError('Branch not found')

            const response = await model.createUser({ username, password: md5(password), repeat_password, birthdate, gender, branch: checkBranch.branch_id })
            
            if(!response) throw new UserInputError("you gave the values more than specified")

            const token = jwt.sign({ userid: response.user_id, userAgent: clientAgent, userIP: clientIP})
           
            await model.defaultPermission1({ user_id: response.user_id})

            return {
                status: 201,
                success: true,
                message: 'The user successfully registered!',
                data: JSON.stringify({token})
            }
        }
   
    },

}