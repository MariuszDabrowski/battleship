import { Game } from './Game';
import { game } from './index';

export default class Grid {
  element = document.querySelector('.grid') as HTMLDivElement;
  cellElements: HTMLDivElement[] = [];
  leadCell: HTMLDivElement;
  array = [];

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
    this.array = new Array(Game.boardSize.cellsHigh).fill(
      new Array(Game.boardSize.cellsWide).fill(0)
    );

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
      // Get a reference to the lead cell
      this.leadCell = this.cellElements[row * Game.boardSize.cellsWide + col + cellsToSelect[0]];

      game.activeShip.validSpaceToDrop = true;
    } else {
      game.activeShip.validSpaceToDrop = false;
    }
  }
}
