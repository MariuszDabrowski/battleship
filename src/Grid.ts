import { Game } from './index';

export default class Grid {
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

  // -----------
  // Constructor
  // -----------

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

  // --------------------------
  // Update drop indicator size
  // --------------------------

  updateDropInidcatorSize(length: number, width: number) {
    this.dropIndicatorElement.style.width = `${length}px`;
    this.dropIndicatorElement.style.height = `${width}px`;
  }

  // --------------------------------------------------
  // Update drop indicator position and make it visible
  // --------------------------------------------------

  showDropIndicator(x: number, y: number) {
    this.dropIndicatorElement.classList.remove('grid__drop-indicator--hidden');
    this.dropIndicatorElement.style.left = `${x}px`;
    this.dropIndicatorElement.style.top = `${y}px`;
  }

  // -----------------------
  // Hide the drop indicator
  // -----------------------

  hideDropIndicator() {
    this.dropIndicatorElement.classList.add('grid__drop-indicator--hidden');
  }
}
