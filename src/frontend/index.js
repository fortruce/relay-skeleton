import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import ExampleRoute from './routes/ExampleRoute';
import Application from './containers/Application';

class Root extends React.Component {
  render() {
    return (
      <Relay.RootContainer
        Component={ Application }
        route={ new ExampleRoute() } />
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('container')
);
