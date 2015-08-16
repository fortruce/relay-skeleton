import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  Game,
  HidingSpot,
  checkHidingSpotForTreasure,
  getGame,
  getHidingSpot,
  getHidingSpots,
  getTurnsRemaining
} from './database';

/**
 * The first argument defines the way to resolve an ID to its object.
 * The second argument defines the way to resolve a node object to its GraphQL type.
 */
var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    var { type, id } = fromGlobalId(globalId);
    if (type === 'Game')
      return getGame(id);
    else if (type === 'HidingSpot')
      return getHidingSpot(id);
    return null;
  },
  (obj) => {
    if (obj instanceof Game)
      return gameType;
    else if (obj instanceof HidingSpot)
      return hidingSpotType;
    return null;
  }
);

var hidingSpotType = new GraphQLObjectType({
  name: 'HidingSpot',
  description: 'A place where you might find treasure',
  fields: () => ({
    id: globalIdField('HidingSpot'),
    hasBeenChecked: {
      type: GraphQLBoolean,
      description: 'True if this spot has already been checked for treasure',
      resolve: (hidingSpot) => hidingSpot.hasBeenChecked
    },
    hasTreasure: {
      type: GraphQLBoolean,
      description: 'True if this spot has treasure',
      resolve: (hidingSpot) => {
        if (!hidingSpot.hasBeenChecked)
          return null;
        return hidingSpot.hasTreasure;
      }
    }
  }),
  interfaces: [ nodeInterface ]
});

var { connectionType: hidingSpotConnection } = connectionDefinitions({
  name: 'HidingSpot',
  nodeType: hidingSpotType
});

var gameType = new GraphQLObjectType({
  name: 'Game',
  description: 'A treasure search game',
  fields: () => ({
    id: globalIdField('Game'),
    hidingSpots: {
      type: hidingSpotConnection,
      description: 'Places where treasure might be hidden',
      args: connectionArgs,
      resolve: (game, args) => connectionFromArray(getHidingSpots(), args)
    },
    turnsRemaining: {
      type: GraphQLInt,
      description: 'The number of turns a player has left to find the treasure',
      resolve: () => getTurnsRemaining()
    }
  }),
  interfaces: [ nodeInterface ]
});

var CheckHidingSpotForTreasureMutation = mutationWithClientMutationId({
  name: 'CheckHidingSpotForTreasure',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    hidingSpot: {
      type: hidingSpotType,
      resolve: ({localHidingSpotId}) => {
        console.log('hiding spot resolved');
        return getHidingSpot(localHidingSpotId);
      }
    },
    game: {
      type: gameType,
      resolve: () => getGame()
    }
  },
  mutateAndGetPayload: ({id}) => {
    var localHidingSpotId = fromGlobalId(id).id;
    checkHidingSpotForTreasure(localHidingSpotId);
    return {localHidingSpotId};
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    checkHidingSpotForTreasure: CheckHidingSpotForTreasureMutation
  })
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    game: {
      type: gameType,
      resolve: () => getGame()
    }
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});