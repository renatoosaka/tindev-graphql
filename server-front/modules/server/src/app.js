import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import socketIO from "socket.io";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import routes from "./routes";
import schema from "./schemas";
import { database } from "./config";

class App {
  constructor() {
    this.express = express();
    this.server = http.Server(this.express);
    this.io = socketIO(this.server);
    this.connectedUsers = {};

    this.express.disable("x-powered-by");

    this.socketConnection();
    this.database();
    this.middlewares();
    this.routes();
    this.graphQL();
  }

  database() {
    mongoose.connect(database.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    mongoose.set("useFindAndModify", false);
  }

  middlewares() {
    this.express.use(helmet());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
    this.express.use(cors());
  }

  routes() {
    this.express.use(routes);
  }

  graphQL() {
    const apolloServer = new ApolloServer({
      schema,
      playground: true,
      context: ({ req, res }) => {
        return { req, res, io: this.io, connectedUsers: this.connectedUsers };
      }
    });

    apolloServer.applyMiddleware({ app: this.express });
  }

  socketConnection() {
    this.io.on("connection", socket => {
      const { user } = socket.handshake.query;

      this.connectedUsers[user] = socket.id;
    });
  }
}

export default new App().server;
