import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLError } from "graphql";

import RootResolver from "./graphql/resolver";

import { customAuthChecker } from "./middlewares/auth";


const port = process.env.PORT || 4000;

export const init = async () => {
  const app = express();

  // logger.info("Initilizing Routes...");
  // app.use('/a/i', express.static(config.file.imageDir));
  // app.use('/a/v', express.static(config.file.videoDir));
  // app.use(routes);

  import("./db/db");

  // logger.info("Initilizing Apollo Server...");
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: RootResolver,
      validate: false,
      authChecker: customAuthChecker,
    }),
    debug: true,
    formatError: (err: GraphQLError) => {
      // logger.error(err);
      // if(err.message.startsWith(config.error.dbLogPrefix) && config.env !== "dev") {
      //   return new Error("Internal server error");
      // }
      // if(process.env.ENV !== "dev") {
      //   return new Error("Internal server error");
      // }
      return err;
    },
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: true });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`Access graphql API at http://localhost:${port}/graphql`);
  }) 
}
