import Ship from './Ship';
import Dock from './Dock';
import Grid from './Grid';

export class Game {
  static boardSize = { cellsWide: 10, cellsHigh: 14 };
  static gridCellSize = 40;

  ships: Ship[] = [];
  activeShip: Ship;
  dock = new Dock();
  grid: Grid;

  constructor() {
    this.generateShips();
    this.grid = new Grid();
  }

  // --------------
  // Generate ships
  // --------------

  generateShips() {
    this.ships.push(new Ship([3, 1]));
    this.ships.push(new Ship([4, 1]));

    // Place ships in the dock
    this.dock.populateDock(this.ships);
  }
}
