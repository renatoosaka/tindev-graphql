import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString
} from "graphql";
import { DevType, InputDevType } from "./types";
import { list, store, like, dislike } from "./resolvers";

const Query = new GraphQLObjectType({
  name: "QueryDev",
  fields: {
    devs: {
      type: GraphQLList(DevType),
      resolve: list
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "MutationUsuario",
  fields: {
    create: {
      type: DevType,
      args: { username: { type: GraphQLNonNull(GraphQLString) } },
      resolve: store
    },
    like: {
      type: DevType,
      args: { devId: { type: GraphQLNonNull(GraphQLString) } },
      resolve: like
    },
    dislike: {
      type: DevType,
      args: { devId: { type: GraphQLNonNull(GraphQLString) } },
      resolve: dislike
    }
  }
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  types: [DevType, InputDevType]
});
