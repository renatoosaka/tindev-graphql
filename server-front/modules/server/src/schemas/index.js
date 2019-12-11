import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { mergeSchemas } from "graphql-tools";
import DevSchema from "./dev";

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    versao: {
      type: GraphQLString,
      resolve: () => "v1.0.0"
    }
  }
});

export default mergeSchemas({
  schemas: [
    new GraphQLSchema({
      query
    }),
    DevSchema
  ]
});
