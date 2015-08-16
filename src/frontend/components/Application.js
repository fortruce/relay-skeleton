import React from 'react';
import Relay from 'react-relay';

class Application extends React.Component {
  render() {
    return (
      <div>
        { this.props.example.text }
        { this.props.example.id }
      </div>
    );
  }
}

export default Relay.createContainer(Application, {
  fragments: {
    example: () => Relay.QL`
      fragment on Example {
        text,
        id
      }
    `
  }
});