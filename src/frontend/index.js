import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import AppHomeRoute from './routes/AppHomeRoute';
import Application from './components/Application';

class Root extends React.Component {
  render() {
    return (
      <Relay.RootContainer 
        Component={ Application }
        route={ new AppHomeRoute() }
      />
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('container')
);