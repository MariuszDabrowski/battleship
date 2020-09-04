import { Game, game } from './index';

export default class Ship {
  public element: HTMLDivElement;
  public position = { x: 0, y: 0 }; // Relative to the window
  public relativePosition = { x: 0, y: 0 }; // Relative to the dock
  public lastValidPosition = { x: 0, y: 0 };
  public shipOverGrid = false;
  private validSpace = false;
  private arrayCoordinates: [col: number, row: number] = [0, 0];
  private gridSpotChanged = true; // To prevent too many function fires on mouse move, we only update when we hover over a new cell

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
    const div = document.createElement('div');
    div.classList.add('ship');
    div.style.width = `${this.size[0] * Game.gridCellSize}px`;
    div.style.height = `${this.size[1] * Game.gridCellSize}px`;
    div.addEventListener('mousedown', this.pickupShip.bind(this));
    this.element = div;
  }

  // -----------
  // Pickup ship
  // -----------

  private pickupShip(e: MouseEvent) {
    e.preventDefault();

    // Enable ability to move the ship
    document.addEventListener('mousemove', this.draggingShip);
    document.addEventListener('mouseup', this.dropShip);

    //
    this.relativePosition.x = Math.abs(this.element.offsetLeft - e.clientX);
    this.relativePosition.y = Math.abs(this.element.offsetTop - e.clientY);
    console.log(this.relativePosition);
    this.element.classList.add('ship--picked-up');
  }

  // --------------------
  // Update ship position
  // --------------------

  private updateShipsPosition(x: number, y: number) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  // -------------
  // Dragging ship
  // -------------

  private draggingShip(e: MouseEvent) {
    this.updatePositionCoordinates();
    this.checkIfShipIsOverGrid();
    this.updateShipsPosition(
      e.clientX - this.relativePosition.x,
      e.clientY - this.relativePosition.y
    );

    if (this.shipOverGrid) {
      // Convert the ships position to array coordinates
      this.convertPositionToCoordinates();

      // Only update if we hovered over a new grid spot, this is to prevent too many funciton fires on mouse move
      if (this.gridSpotChanged) {
        this.gridSpotChanged = false;

        // Check if spot to drop the boat is valid
        this.checkIfValidSpot();

        // Show the drop indicator
        game.grid.updateDropInidcatorSize(
          this.size[0] * Game.gridCellSize,
          this.size[1] * Game.gridCellSize
        );
        game.grid.showDropIndicator(
          this.arrayCoordinates[0] * Game.gridCellSize,
          this.arrayCoordinates[1] * Game.gridCellSize
        );
      }
    } else {
      this.validSpace = false;
      game.grid.hideDropIndicator();
    }
    // Check to see if this is a valid spot
    // On drop update the current and lastGood pos to current
  }

  // ---------
  // Drop ship
  // ---------

  private dropShip(e: MouseEvent) {
    document.removeEventListener('mousemove', this.draggingShip);
    document.removeEventListener('mouseup', this.dropShip);

    if (this.validSpace) {
      console.log('update ship position');

      // const x = this.relativePosition[0];
      // const y = this.relativePosition[1];

      console.log(this.relativePosition);

      // this.element.style.left = `${x}px`;
      // this.element.style.top = `${y}px`;
    } else {
      console.log(this.relativePosition);

      this.element.style.left = `${this.lastValidPosition.x}px`;
      this.element.style.top = `${this.lastValidPosition.y}px`;
    }

    game.grid.hideDropIndicator();

    this.element.classList.remove('ship--picked-up');
  }

  // --------------------------------
  // Update ship position coordinates
  // --------------------------------

  private updatePositionCoordinates() {
    this.position.x = this.element.offsetLeft + game.dock.element.offsetLeft;
    this.position.y = this.element.offsetTop + game.dock.element.offsetTop;
  }

  // ------------------------------
  // Check if ship is over the grid
  // ------------------------------

  private checkIfShipIsOverGrid() {
    const shipWidth = this.size[0] * Game.gridCellSize;
    const shipHeight = this.size[1] * Game.gridCellSize;
    const threshold = Game.gridCellSize / 2;

    // Check if ship is without the bounds of the grid
    if (
      this.position.x > game.grid.bounds.left - threshold &&
      this.position.x + shipWidth < game.grid.bounds.right + threshold &&
      this.position.y > game.grid.bounds.top - threshold &&
      this.position.y + shipHeight < game.grid.bounds.bottom + threshold
    ) {
      this.shipOverGrid = true;
    } else {
      this.shipOverGrid = false;
    }
  }

  // -------------------------------------
  // Convert position to array coordinates
  // -------------------------------------

  private convertPositionToCoordinates() {
    const x = Math.abs(
      Math.round((this.position.x - game.grid.position.x) / Game.gridCellSize)
    );
    const y = Math.abs(
      Math.round((this.position.y - game.grid.position.y) / Game.gridCellSize)
    );

    // Check to see if we're hovering over a new grid spot
    if (this.arrayCoordinates[0] !== x || this.arrayCoordinates[1] !== y) {
      this.gridSpotChanged = true;
    }

    this.arrayCoordinates = [x, y];
  }

  // -------------------------------------------------------
  // Check is spot the ship is over is a valid place to drop
  // -------------------------------------------------------

  private checkIfValidSpot() {
    // Get the grid spots the boat is occupying
    const occupyingSpots = [];

    for (let i = 0; i < this.size[0]; i++) {
      occupyingSpots.push([
        this.arrayCoordinates[1],
        this.arrayCoordinates[0] + i,
      ]);
    }

    this.validSpace = game.grid.verifySpot(occupyingSpots);
  }
}
