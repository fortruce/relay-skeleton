import Application from '../components/Application';
import Relay from 'react-relay';

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