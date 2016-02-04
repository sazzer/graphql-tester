import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLSchema
} from 'graphql';

const QueryRootType = new GraphQLObjectType({
    name: 'QueryRoot',
    fields: {
        test: {
            type: GraphQLString,
            args: {
                who: {
                    type: GraphQLString
                }
            },
            resolve: (root, { who }) => 'Hello ' + (who || 'World')
        },
        thrower: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: () => { throw new Error('Throws!'); }
        }
    }
});

export const TestSchema = new GraphQLSchema({
    query: QueryRootType
});
