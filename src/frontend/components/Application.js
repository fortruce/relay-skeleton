import React from 'react';
import Relay from 'react-relay';

import CheckHidingSpotForTreasureMutation from '../mutations/CheckHidingSpotForTreasureMutation';

class Application extends React.Component {
  _getHidingSpotStyle(spot) {
    let color = 'black';
    if (spot.hasBeenChecked) {
      if (spot.hasTreasure)
        color = 'green';
      else
        color = 'red';
    }
    return {
      backgroundColor: color,
      cursor: this._isGameOver() ? null : 'pointer',
      display: 'inline-block',
      width: 100,
      height: 100,
      marginRight: 10
    };
  }
  _handleHidingSpotClick(hidingSpot) {
    if (this._isGameOver()) {
      return;
    }
    Relay.Store.update(
      new CheckHidingSpotForTreasureMutation({
        game: this.props.game,
        hidingSpot
      })
    );
  }
  _isGameOver() {
    return !this.props.game.turnsRemaining ||
            this.props.game.hidingSpots.edges.some(edge => edge.node.hasTreasure);
  }
  renderGame() {
    return this.props.game.hidingSpots.edges
      .map(edge => edge.node)
      .map(node => (
        <div
          key={ node.id }
          onClick={this._handleHidingSpotClick.bind(this, node)}
          style={ this._getHidingSpotStyle(node) } />
      ));
  }
  render() {
    return (
      <div>
        { this._isGameOver() ? 'Game Over!' : 'Find the Treasure!' }
        <p>{ this.props.game.turnsRemaining }</p>
        { this.renderGame() }
      </div>
    );
  }
}

export default Relay.createContainer(Application, {
  fragments: {
    game: () => Relay.QL`
      fragment on Game {
        turnsRemaining,
        hidingSpots(first: 9) {
          edges {
            node {
              hasBeenChecked,
              hasTreasure,
              id,
              ${CheckHidingSpotForTreasureMutation.getFragment('hidingSpot')}
            }
          }
        },
        ${CheckHidingSpotForTreasureMutation.getFragment('game')}
      }
    `
  }
});