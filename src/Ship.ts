import { Game, game } from './index';

export default class Ship {
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
