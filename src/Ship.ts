import { Game } from './Game';
import { game } from './index';

export default class Ship {
  public shipOutlineElement: HTMLDivElement;
  public shipElement: HTMLDivElement;
  private shipClickOffset: { x: number; y: number } = { x: 0, y: 0 };
  public cellsToSelect: number[] = [];
  public validSpaceToDrop = false;
  public occupyingCells: HTMLDivElement[] = [];
  public occupyingCoordinates: { row: number; col: number }[] = [];

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
    const width = `${this.size[0] * Game.gridCellSize}px`;
    const height = `${this.size[1] * Game.gridCellSize}px`;

    const shipElement = document.createElement('div');
    shipElement.classList.add('ship');
    shipElement.style.width = width;
    shipElement.style.height = height;
    shipElement.addEventListener('mousedown', this.pickupShip.bind(this));
    this.shipElement = shipElement;

    const shipOutlineElement = document.createElement('div');
    shipOutlineElement.classList.add('ship-outline');
    shipOutlineElement.style.width = width;
    shipOutlineElement.style.height = height;
    shipOutlineElement.appendChild(this.shipElement);
    this.shipOutlineElement = shipOutlineElement;
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

    // Clear up grid spots ship was occupying
    if (this.occupyingCoordinates) {
      this.occupyingCoordinates.forEach((coordinate) => {
        const { row, col } = coordinate;
        game.grid.array[row][col] = 0;
      });
    }
  }

  // -------------
  // Dragging ship
  // -------------

  private draggingShip(e: MouseEvent) {
    this.updateShipsPosition(e);
  }

  // --------------------
  // Update ship position
  // --------------------

  private updateShipsPosition(e: MouseEvent) {
    const offsetParent = this.shipElement.offsetParent as HTMLDivElement;
    const offsetLeft = this.shipElement.offsetLeft || offsetParent.offsetLeft;
    const offsetTop = this.shipElement.offsetTop || offsetParent.offsetTop;

    const newX = (e.clientX - offsetLeft - this.shipClickOffset.x) / 10;
    const newY = (e.clientY - offsetTop - this.shipClickOffset.y) / 10;

    this.shipElement.style.transform = `translate(${newX}rem, ${newY}rem)`;
  }

  // ---------
  // Drop ship
  // ---------

  private dropShip(e: MouseEvent) {
    document.removeEventListener('mousemove', this.draggingShip);
    document.removeEventListener('mouseup', this.dropShip);

    game.activeShip = null;

    if (this.validSpaceToDrop) {
      this.restShipInNewSpace();
    } else {
      // Return to last valid position
      this.shipElement.style.transform = '';

      // Remark the array
      if (this.occupyingCoordinates) {
        this.occupyingCoordinates.forEach((coordinate) => {
          const { row, col } = coordinate;
          game.grid.array[row][col] = 1;
        });
      }
    }

    this.shipElement.style.pointerEvents = 'all';
  }

  // ----------------------
  // Rest ship in new space
  // ----------------------

  private restShipInNewSpace() {
    const leadClass = 'grid__cell--lead';

    // Clear out old ship location info
    if (this.occupyingCells[0]) {
      this.occupyingCells[0].classList.remove(leadClass);

      // Empty array cells that are now freed up
      this.occupyingCoordinates.forEach((coordinate) => {
        const { row, col } = coordinate;
        game.grid.array[row][col] = 0;
      });
    }

    // Update ship location information
    this.occupyingCells = game.grid.occupyingCellElements;
    this.occupyingCoordinates = game.grid.occupyingCoordinates;
    this.occupyingCells[0].classList.add(leadClass);

    // Update array information with new ship location
    this.occupyingCoordinates.forEach((coordinate) => {
      const { row, col } = coordinate;
      game.grid.array[row][col] = 1;
    });

    // Drop into the grid
    this.shipElement.style.transform = '';
    this.occupyingCells[0].appendChild(this.shipElement);
  }
}
