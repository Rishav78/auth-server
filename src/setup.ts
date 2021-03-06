import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import RootResolver from "./graphql/resolver";

import { customAuthChecker } from "./lib/middlewares/auth";
import { handleError, HTTP404Error } from "./lib/middlewares";

import router from "./routes";

import {logger} from "./core";

export const init = async () => {
  const port = process.env.PORT || 4000;
  const app = express();

  logger.info("Connecting to database...");
  import("./db/db");
  logger.info("Connection established");

  logger.info("Initilizing Middlewares...");
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  logger.info("Initilizing Apollo Server...");
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: RootResolver,
      validate: false,
      authChecker: customAuthChecker,
    }),
    logger,
    debug: process.env.NODE_ENV === "development",
    playground: true,
    introspection: true,
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: true });

  logger.info("Initilizing Routes...");
  app.use(router);

  /**
   * error handler router
   */
  app.use(handleError());

  /**
   * invalid route handler
   */
  app.use(HTTP404Error());

  app.listen(port, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}`);
    logger.info(`Access graphql API at http://localhost:${port}/graphql`);
  }) 
}
