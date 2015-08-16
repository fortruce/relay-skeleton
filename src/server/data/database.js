export class Game extends Object {}
export class HidingSpot extends Object {
  constructor(id, hasTreasure) {
    super();
    this.id = id;
    this.hasTreasure = hasTreasure;
    this.hasBeenChecked = false;
  }
}

var game = new Game();
game.id = 1;

var hidingSpots = [];
(function() {
  var hidingSpot;
  var indexOfSpotWithTreasure = Math.floor(Math.random() * 9);
  for (var i = 0; i < 9; i++) {
    hidingSpot = new HidingSpot(i, i === indexOfSpotWithTreasure);
    hidingSpots.push(hidingSpot);
  }
})();

var turnsRemaining = 3;

export function getHidingSpot(id) {
  return hidingSpots[id];
}

export function checkHidingSpotForTreasure(id) {
  if (hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked))
    return;
  turnsRemaining--;
  var hidingSpot = getHidingSpot(id);
  hidingSpot.hasBeenChecked = true;
  console.log('checked hiding spot', JSON.stringify(hidingSpot, null, 2));
}

export function getGame() { return game; }
export function getHidingSpots() { return hidingSpots; }
export function getTurnsRemaining() { return turnsRemaining; }