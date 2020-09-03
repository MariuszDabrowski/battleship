import Ship from './Ship';
import { Game } from './index';

export default class Dock {
  element = document.querySelector('.dock') as HTMLDivElement;
  shipSpacing = Game.gridCellSize * 0.75;

  constructor() {}

  populateDock(ships: Ship[]) {
    // Update dock dimensions
    const verticalPadding = (ships.length + 1) * this.shipSpacing;
    const verticalShipSize =
      ships[0].size[1] * Game.gridCellSize * ships.length;
    this.element.style.height = `${verticalPadding + verticalShipSize}px`;

    const horizontalPadding = this.shipSpacing * 2;
    const longestShip = ships.reduce((acc, cur) => {
      if (cur.size[0] > acc) acc = cur.size[0];
      return acc;
    }, 0);
    const horizontalShipSize = longestShip * Game.gridCellSize;
    this.element.style.width = `${horizontalPadding + horizontalShipSize}px`;

    // Populate with ships
    ships.forEach((ship, index) => {
      // Figure out the position for each ship
      ship.relativePosition.x = this.shipSpacing;
      ship.relativePosition.y =
        this.shipSpacing * (index + 1) +
        ship.size[1] * Game.gridCellSize * index;
      ship.lastValidPosition = { ...ship.relativePosition };

      // Update element position
      ship.element.style.left = `${ship.relativePosition.x}px`;
      ship.element.style.top = `${ship.relativePosition.y}px`;

      // Add ships to the DOM
      this.element.appendChild(ship.element);
    });
  }
}
