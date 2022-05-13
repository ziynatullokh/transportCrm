import { makeExecutableSchema } from '@graphql-tools/schema'

import UserModule from './user/index.js'
import PermissionModule from './permission/index.js'
import TransportModule from './transport/index.js'
import TypesModule from './types/index.js'
import BranchesModule from './branches/index.js'

export default makeExecutableSchema({
    typeDefs: [
        UserModule.typeDefs,
        PermissionModule.typeDefs,
        TransportModule.typeDefs,
        BranchesModule.typeDefs,
        TypesModule.typeDefs
    ],
    resolvers: [
        UserModule.resolvers,
        PermissionModule.resolvers,
        TransportModule.resolvers,
        BranchesModule.resolvers,
        TypesModule.resolvers
    ]
})