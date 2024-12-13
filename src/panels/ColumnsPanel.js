import { BasePanel } from "./BasePanel.js";

const columns = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 1, 7, 9, 10, 6, 11],
  [12, 13, 9, 14, 15, 3, 10],
  [16, 17, 18, 5, 14, 11, 19],
  [20, 19, 18, 21, 17, 22, 23],
  [16, 8, 24, 25, 20, 26, 27],
];

export class ColumnsPanel extends BasePanel {
  /** @type {integer} */
  expectedIndex;

  constructor(scene, x, y, onPanelCompleted, symbolPalette) {
    super(scene, x, y, onPanelCompleted);
    this.symbolPalette = symbolPalette; // characters or minecraft
    this.symbolsClicked = 0;
    this.selectedSymbols = [];
    this.sortedSymbols = [];
    this.buttons = [];
    this.create();
  }

  /**
   * Método auxiliar para seleccionar un número aleatorio de elementos de un array dado
   * sin repetición. En esta clase sirve fundamentalmente para seleccionar los elementos
   * de la secuencia del manual elegida que deberán pintarse en el nivel. Siempre se escogen
   * tantos elementos como se especifiquen por parámetro.
   * @param array array sobre el que elegir un subarray de elementos aleatorios sin repetición.
   * @param n número de elementos que queremos seleccionar del array
   * @returns array con un número arbitrario de elementos del array original (n), con la posición original en su secuencia.
   */
  pickRandomElements(array, n) {
    // realizamos una copia el array original para immediatamente después
    // hacer un shuffle y quedarnos con tantos elementos como los que decidiéramos
    // en el paso anterior. En cada elemento ponemos el índice original para luego saber compararlos.
    const shuffledArray = [...array].map((elem, i) => ({
      characterIndex: elem,
      index: i,
    }));
    Phaser.Utils.Array.Shuffle(shuffledArray);
    return shuffledArray.slice(0, n);
  } // pickRandomElements

  create() {
    // Choose a column from which to sample symbols
    const selectedManualSequence = Phaser.Utils.Array.GetRandom(columns);
    // Choose the positions in the column of the symbols that will be displayed
    // Note: this is only the indices (e.g. [0, 3, 1, 6])
    this.selectedSymbols = this.pickRandomElements(selectedManualSequence, 4);
    this.sortedSymbols = [...this.selectedSymbols].sort(
      (a, b) => a.index - b.index
    );
    this.buttons = [];

    const positions = [
      { x: -75, y: -75 },
      { x: 75, y: -75 },
      { x: -75, y: 75 },
      { x: 75, y: 75 },
    ];

    this.selectedSymbols.forEach((symbol, index) => {
      const pos = positions[index];
      const symbolImage = new Phaser.GameObjects.Image(
        this.scene,
        pos.x,
        pos.y,
        this.symbolPalette + "-" + symbol.characterIndex
      )
        .setInteractive()
        .setDisplaySize(100, 100);

      symbolImage.on("pointerdown", () => {
        if (this.status !== "ongoing") return;

        if (
          symbol.characterIndex ===
          this.sortedSymbols[this.symbolsClicked].characterIndex
        ) {
          symbolImage.setTint(0x00ff00);
          this.symbolsClicked++;

          if (this.symbolsClicked === 4) {
            this.status = "success";
            this.completePanel(true);
          }
        } else {
          symbolImage.setTint(0xff0000);
          this.status = "failure";
          this.completePanel(false);
        }
      });
      this.add(symbolImage);
      this.buttons.push(symbolImage);
    });

    this.setVisible(false);
  }

  completePanel(success) {
    const color = success ? 0x00ff00 : 0xff0000;

    this.buttons.forEach((b) => b.setTint(color).disableInteractive(true));

    super.completePanel(success);
  } // completePanel
} // ColumnsPanel
