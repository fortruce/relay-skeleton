import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} from 'graphql';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} from 'graphql-relay';

const example = {
  id: 1,
  text: 'Hello World'
};

/**
 * The first argument defines the way to resolve an ID to its object.
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */
var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    let { id, type } = fromGlobalId(globalId);
    if (type === 'Example')
      return example;
    return null;
  },
  (obj) => {
    return exampleType;
  }
);

var exampleType = new GraphQLObjectType({
  name: 'Example',
  fields: () => ({
    id: globalIdField('Example'),
    text: {
      type: GraphQLString,
      description: 'Hello World'
    }
  }),
  interfaces: [ nodeInterface ]
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    example: {
      type: exampleType,
      resolve: () => example
    }
  })
});

export var Schema = new GraphQLSchema({
  query: queryType
});