import { Game } from './Game';
import { game } from './index';

export default class Ship {
  public shipElement: HTMLDivElement;
  private shipClickOffset: { x: number; y: number } = { x: 0, y: 0 };
  public cellsToSelect: number[] = [];
  public validSpaceToDrop = false;

  // -----------
  // Constructor
  // -----------

  constructor(public size: [length: number, width: number]) {
    this.createShipDiv();
    this.draggingShip = this.draggingShip.bind(this);
    this.dropShip = this.dropShip.bind(this);
  }

  // ---------------
  // Create ship div
  // ---------------

  private createShipDiv() {
    const shipElement = document.createElement('div');
    shipElement.classList.add('ship');
    shipElement.style.width = `${this.size[0] * Game.gridCellSize}px`;
    shipElement.style.height = `${this.size[1] * Game.gridCellSize}px`;
    shipElement.addEventListener('mousedown', this.pickupShip.bind(this));
    this.shipElement = shipElement;
  }

  // -----------
  // Pickup ship
  // -----------

  private pickupShip(e: MouseEvent) {
    e.preventDefault();

    const shipSize = this.shipElement.clientWidth / Game.gridCellSize;
    const cellClicked = Math.ceil(e.offsetX / Game.gridCellSize);

    this.cellsToSelect = [];

    for (let i = 1; i <= shipSize; i++) {
      this.cellsToSelect.push(i - cellClicked);
    }

    game.activeShip = this;

    // Allow the ability to listen to events through the ship (hovering over grid cells)
    this.shipElement.style.pointerEvents = 'none';

    this.shipClickOffset.x = e.offsetX;
    this.shipClickOffset.y = e.offsetY;

    // Enable ability to move the ship
    document.addEventListener('mousemove', this.draggingShip);
    document.addEventListener('mouseup', this.dropShip);
  }

  // --------------------
  // Update ship position
  // --------------------

  private updateShipsPosition(e: MouseEvent) {
    const newX = (e.clientX - this.shipElement.offsetLeft - this.shipClickOffset.x) / 10;
    const newY = (e.clientY - this.shipElement.offsetTop - this.shipClickOffset.y) / 10;

    this.shipElement.style.transform = `translate(${newX}rem, ${newY}rem)`;
  }

  // -------------
  // Dragging ship
  // -------------

  private draggingShip(e: MouseEvent) {
    this.updateShipsPosition(e);
  }

  // ---------
  // Drop ship
  // ---------

  private dropShip(e: MouseEvent) {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.draggingShip);
    document.removeEventListener('mouseup', this.dropShip);

    if (this.validSpaceToDrop) {
      this.shipElement.style.transform = '';
      game.grid.leadCell.appendChild(this.shipElement);
    } else {
      this.shipElement.style.transform = '';
    }

    this.shipElement.style.pointerEvents = 'all';
  }
}
