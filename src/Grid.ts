import { Game } from './Game';
import { game } from './index';

export default class Grid {
  public element = document.querySelector('.grid') as HTMLDivElement;
  public cellElements: HTMLDivElement[] = [];
  public array = [];
  public occupyingCellElements: HTMLDivElement[] = [];
  public occupyingCoordinates: { row: number; col: number }[] = [];

  // -----------
  // Constructor
  // -----------

  constructor() {
    // Set the CSS grid size
    document.documentElement.style.setProperty('--grid-cell-size', `${Game.gridCellSize}px`);

    // Set grid width and height
    this.element.style.width = `${Game.boardSize.cellsWide * Game.gridCellSize}px`;
    this.element.style.height = `${Game.boardSize.cellsHigh * Game.gridCellSize}px`;

    // // Generate grid array
    this.array = new Array(Game.boardSize.cellsHigh);
    for (let i = 0; i < this.array.length; i++) {
      this.array[i] = new Array(Game.boardSize.cellsWide).fill(0);
    }

    this.generateCells();
  }

  // -------------------
  // Generate grid cells
  // -------------------

  private generateCells() {
    let gridCells = new DocumentFragment();

    // Generate grid cells
    for (let i = 0; i < Game.boardSize.cellsWide * Game.boardSize.cellsHigh; i++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('grid__cell');
      gridCell.setAttribute('row', Math.floor(i / Game.boardSize.cellsWide).toString());
      gridCell.setAttribute('col', (i % Game.boardSize.cellsWide).toString());

      this.cellElements.push(gridCell);

      gridCell.addEventListener('mouseenter', this.cellEnter.bind(this));
      gridCell.addEventListener('mouseleave', this.cellLeave.bind(this));

      gridCells.appendChild(gridCell);
    }

    this.element.appendChild(gridCells);
  }

  // ----------
  // Cell Hover
  // ----------

  private cellEnter(e: MouseEvent) {
    if (!game.activeShip) return;

    this.validateDropSite(e);
  }

  // --------------
  // Cell hover out
  // --------------

  private cellLeave(e: MouseEvent) {
    if (!game.activeShip) return;

    const relatedTarget = e.relatedTarget as HTMLDivElement;
    if (!relatedTarget.classList.contains('grid__cell')) {
      game.activeShip.validSpaceToDrop = false;
    }
  }

  // ------------------
  // Validate drop site
  // ------------------

  private validateDropSite(e: MouseEvent) {
    if (!game.activeShip) return;

    const target = e.target as HTMLDivElement;
    const row = Number(target.getAttribute('row'));
    const col = Number(target.getAttribute('col'));

    // Check if valid place to put down
    let validSpot = true;
    const cellsToSelect = game.activeShip.cellsToSelect;

    for (let i = 0; i < cellsToSelect.length; i++) {
      if (this.array[row][col + cellsToSelect[i]] !== 0) {
        validSpot = false;
        break;
      }
    }

    if (validSpot) {
      // Update the valid coordinates the ship is hovering over
      this.occupyingCoordinates = cellsToSelect.reduce((acc, offsetIndex) => {
        acc.push({ row: row, col: col + offsetIndex });
        return acc;
      }, []);

      // Update the valid elements the ship is hovering over
      this.occupyingCellElements = this.occupyingCoordinates.reduce((acc, coordinates) => {
        const { row, col } = coordinates;
        acc.push(this.cellElements[row * Game.boardSize.cellsWide + col]);

        return acc;
      }, []);

      game.activeShip.validSpaceToDrop = true;
    } else {
      game.activeShip.validSpaceToDrop = false;
    }
  }
}
