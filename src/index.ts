import Ship from './Ship';
import Dock from './Dock';
import Grid from './Grid';

// How to place ships
// - If a ship is dropped anywhere that's not legal they will animate back to their home position
// - When dragging a ship over a valid space, that space should light up green to let you know that you can drop it
// - When rotation a ship, it will rotate from the front square of the ship, if unable to rotate a ship should shake and turn red
// -

// Todo:
// - Change ship size to an object for easier reading
// - Refactor checkIfShipIsOverGrid method

export class Game {
  static gridCellSize = 30;
  ships: Ship[] = [];
  dock = new Dock();
  grid: Grid;

  constructor() {
    this.generateShips();
    // When the dock is populated with ships its width changes, shifting elements around it
    // We want to wait for the grid to be in its final resting place before calculating its final position values
    this.grid = new Grid();
  }

  generateShips() {
    // Generate player ships
    this.ships.push(new Ship([3, 1]));
    this.ships.push(new Ship([4, 1]));

    // Place ships in the dock
    this.dock.populateDock(this.ships);
  }
}

// ----------
// Start Game
// ----------

export const game = new Game();

// ------------
// Snap To Grid
// ------------

// function snapToGrid() {
//   const remainderTop = ship.offsetTop % 30;
//   const remainderLeft = ship.offsetLeft % 30;

//   remainderTop >= 15
//     ? (state.y = ship.offsetTop + (30 - remainderTop))
//     : (state.y = ship.offsetTop - remainderTop);

//   remainderLeft >= 15
//     ? (state.x = ship.offsetLeft + (30 - remainderLeft))
//     : (state.x = ship.offsetLeft - remainderLeft);

//   // Make sure ship is not sticking out of bounds

//   ship.style.top = `${state.y}px`;
//   ship.style.left = `${state.x}px`;
// }
