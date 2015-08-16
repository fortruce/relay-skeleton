import express from 'express';
import { Schema } from './data/schema';
import graphQLHTTP from 'express-graphql';

const app = express();
app.use('/', graphQLHTTP({ schema: Schema, pretty: true }));
app.listen(8080, (err) => {
  if (err)
    return console.error(err);
  console.log('GraphQL Server is now running on localhost:8080');
});