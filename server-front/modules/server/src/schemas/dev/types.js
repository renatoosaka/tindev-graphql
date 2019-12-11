import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString
} from "graphql";

export const DevType = new GraphQLObjectType({
  name: "Dev",
  fields() {
    return {
      _id: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString) },
      user: { type: GraphQLNonNull(GraphQLString) },
      bio: { type: GraphQLString },
      avatar: { type: GraphQLNonNull(GraphQLString) },
      likes: { type: GraphQLList(DevType), resolve: dev => dev.likes },
      dislikes: { type: GraphQLList(DevType), resolve: dev => dev.dislikes },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString }
    };
  }
});
