import Ship from './Ship';

export default class Dock {
  public dockElement = document.querySelector('.dock') as HTMLDivElement;

  // -------------
  // Populate dock
  // -------------

  public populateDock(ships: Ship[]) {
    const shipsFragment = new DocumentFragment();
    ships.forEach((ship) => {
      shipsFragment.appendChild(ship.shipOutlineElement);
    });
    this.dockElement.appendChild(shipsFragment);
  }
}
