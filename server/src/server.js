import cors from "cors"
import express from "express"
import bodyParser from "body-parser"

import { MongoClient } from "mongodb"
import { makeExecutableSchema } from "graphql-tools"
import { graphqlExpress, graphiqlExpress } from "graphql-server-express"

import { typeDefs } from './model/index'
import { schemaResolve } from './resolver/index'

const URL = process.env.HIMT_HOST || 'http://localhost'
const PORT = process.env.HIMT_PORT || 3001
const DB_NAME = process.env.HIMT_DB || 'heroes'
const MONGO_HOST = process.env.HIMT_MONGO_PORT || 'localhost'
const MONGO_PORT = process.env.HIMT_MONGO_PORT || 27017
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)
    const resolvers = schemaResolve(db)

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const homePath = '/heroes'
    const app = express()
    app.use(cors())
    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))
    app.use(homePath, graphiqlExpress({ endpointURL: '/graphql' }))
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })
  } catch (e) {
    console.log(e)
  }
}
