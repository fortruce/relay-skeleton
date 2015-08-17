import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

// purposefully calling Relay 'routes' roots (as in Query Root)
import ExampleRoot from './roots/ExampleRoot';
import Application from './containers/Application';

class Root extends React.Component {
  render() {
    return (
      <Relay.RootContainer
        Component={ Application }
        route={ new ExampleRoot() } />
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('container')
);