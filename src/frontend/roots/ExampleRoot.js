import Relay from 'react-relay';

export default class extends Relay.Route {
  static path = '/';
  static queries = {
    example: (Component) => Relay.QL`
      query {
        example {
          ${Component.getFragment('example')}
        }
      }
    `
  };
  static routeName = 'ExampleRoute';
}