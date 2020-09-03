// How to place ships
// - If a ship is dropped anywhere that's not legal they will animate back to their home position
// - When dragging a ship over a valid space, that space should light up green to let you know that you can drop it
// - When rotation a ship, it will rotate from the front square of the ship, if unable to rotate a ship should shake and turn red
// -

// Todo:
// - Change ship size to an object for easier reading
// - Refactor checkIfShipIsOverGrid method

// ----------
// Ship Class
// ----------

class Ship {
  public element: HTMLDivElement;
  public position = { x: 0, y: 0 }; // Relative to the window
  public relativePosition = { x: 0, y: 0 }; // Relative to the dock
  public lastValidPosition = { x: 0, y: 0 };
  public shipOverGrid = false;
  private validSpace = false;

  constructor(public size: [length: number, width: number]) {
    this.createShipDiv();
    this.draggingShip = this.draggingShip.bind(this);
    this.dropShip = this.dropShip.bind(this);
  }

  private createShipDiv() {
    const div = document.createElement('div');
    div.classList.add('ship');
    div.style.width = `${this.size[0] * Game.gridCellSize}px`;
    div.style.height = `${this.size[1] * Game.gridCellSize}px`;
    div.addEventListener('mousedown', this.pickupShip.bind(this));
    this.element = div;
  }

  private pickupShip(e: MouseEvent) {
    e.preventDefault();

    document.addEventListener('mousemove', this.draggingShip);
    document.addEventListener('mouseup', this.dropShip);

    this.relativePosition.x = Math.abs(this.element.offsetLeft - e.clientX);
    this.relativePosition.y = Math.abs(this.element.offsetTop - e.clientY);
  }

  private updateShipsPosition(x: number, y: number) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  private draggingShip(e: MouseEvent) {
    console.log(this.shipOverGrid);

    this.updatePositionCoordinates();
    this.checkIfShipIsOverGrid();
    this.updateShipsPosition(
      e.clientX - this.relativePosition.x,
      e.clientY - this.relativePosition.y
    );

    // Convert the ships position to array coordinates
    if (this.shipOverGrid) {
      this.convertPositionToCoordinates();
      game.grid.updateDropInidcatorSize(100, 100);
      game.grid.showDropIndicator(0, 0);
    }
    // Check to see if this is a valid spot
    // Create a indicator on the grid
    // On drop update the current and lastGood pos to current
  }

  private dropShip(e: MouseEvent) {
    document.removeEventListener('mousemove', this.draggingShip);
    document.removeEventListener('mouseup', this.dropShip);

    if (this.validSpace) {
      console.log('update ship position');
    } else {
      this.element.style.left = `${this.lastValidPosition.x}px`;
      this.element.style.top = `${this.lastValidPosition.y}px`;
    }

    game.grid.hideDropIndicator();
  }

  private updatePositionCoordinates() {
    this.position.x = this.element.offsetLeft + game.dock.element.offsetLeft;
    this.position.y = this.element.offsetTop + game.dock.element.offsetTop;
  }

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

  private convertPositionToCoordinates() {
    console.log(
      this.position.x,
      this.position.y,
      '---',
      game.grid.position.x,
      game.grid.position.y,
      '---',
      game.grid.bounds.left,
      game.grid.bounds.top
    );

    //
    // console.log(
    //   Math.round((this.position.x - game.grid.position.x) / Game.gridCellSize),
    //   Math.round((this.position.y - game.grid.position.y) / Game.gridCellSize)
    // );
  }
}

// ----------
// Dock Class
// ----------

class Dock {
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

// ----
// Game
// ----

class Grid {
  element = document.querySelector('.grid') as HTMLDivElement;
  dropIndicatorElement = document.querySelector(
    '.grid__drop-indicator'
  ) as HTMLDivElement;
  size = { cellsWide: 10, cellsHigh: 10 };
  position = { x: 0, y: 0 };
  array = [];
  bounds = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  constructor() {
    // Set the CSS grid size
    document.documentElement.style.setProperty(
      '--grid-cell-size',
      `${Game.gridCellSize / 10}rem`
    );

    // Set grid width and height
    this.element.style.width = `${
      this.size.cellsWide * Game.gridCellSize + 1 // 1 extra pixel to close our grid border
    }px`;
    this.element.style.height = `${
      this.size.cellsHigh * Game.gridCellSize + 1
    }px`;

    // Generate grid array
    this.array = new Array(this.size.cellsHigh).fill(
      new Array(this.size.cellsWide).fill(0)
    );

    // Get grid x, y position in document
    const gridRect = this.element.getBoundingClientRect();
    console.log(gridRect);
    this.position.x = gridRect.x;
    this.position.y = gridRect.y;

    // Update the grid bounds
    this.bounds = {
      top: this.position.y,
      right: this.position.x + this.size.cellsWide * Game.gridCellSize,
      bottom: this.position.y + this.size.cellsHigh * Game.gridCellSize,
      left: this.position.x,
    };
  }

  updateDropInidcatorSize(width: number, height: number) {
    this.dropIndicatorElement.style.width = `${width}px`;
    this.dropIndicatorElement.style.width = `${height}px`;
  }

  showDropIndicator(x: number, y: number) {
    this.dropIndicatorElement.classList.remove('grid__drop-indicator--hidden');
    this.dropIndicatorElement.style.left = `${x}px`;
    this.dropIndicatorElement.style.top = `${y}px`;
  }

  hideDropIndicator() {
    this.dropIndicatorElement.classList.add('grid__drop-indicator--hidden');
  }
}

class Game {
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

const game = new Game();

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
