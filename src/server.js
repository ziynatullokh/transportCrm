import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload'
import context from './utils/context.js'
import '#config/index'
import db from '#config/db'
import express from 'express'
import http from 'http'
import path from 'path'
import schema from './modules/index.js'
import host from './utils/getHost.js'
import jwt from './utils/jwt.js'

const serverIP = host({ internal: false })
process.env.serverIP = serverIP

async function startServer() {
    const app = express()
    const httpServer = http.createServer(app)

    app.use(express.static(path.join(process.cwd(), 'uploads')))
    app.use(graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024 }))


    app.get('/root/:user_id', async (req,res) => {
        if(!req.params.user_id) return res.send("Not found")
        try{
            let result = await db('UPDATE users_permissions SET user_create = true WHERE user_id = $1 returning user_id', req.params.user_id)
            result = await db('UPDATE users_permissions SET user_read = true WHERE user_id = $1 returning user_id', req.params.user_id)
            result = await db('UPDATE users_permissions SET user_update = true WHERE user_id = $1 returning user_id', req.params.user_id)
            result = await db('UPDATE users_permissions SET user_delete = true WHERE user_id = $1 returning user_id', req.params.user_id)
            return res.send(result)
        }catch(error){
            return res.send("Error: ", error.message )
        }
        
    })

    const server = new ApolloServer({
        schema,
        context,
        // csrfPrevention: true,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
    })

    await server.start()
    server.applyMiddleware({ app })
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve))
    console.log(`🚀 Server ready at ${serverIP}:${process.env.PORT || 4000}${server.graphqlPath}`)
}



startServer()