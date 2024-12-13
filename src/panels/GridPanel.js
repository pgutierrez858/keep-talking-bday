import { BasePanel } from "./BasePanel.js";

export class GridPanel extends BasePanel {
  constructor(scene, x, y, onPanelCompleted) {
    super(scene, x, y, onPanelCompleted);

    /** "success" | "failure" | "ongoing" */
    this.status = "ongoing";
    this.gridSize = 4; // 4x4 grid
    this.grid = [];
    this.currentPosition = { row: 0, col: 0 };
    this.sequence = [];
    this.sequenceIndex = 0;
    this.onPanelCompleted = onPanelCompleted;
    this.pairsTable = {
      alex_alex: { row: -1, col: -1 }, // ↖️
      alex_chema: { row: -1, col: 0 }, // ↑
      alex_rafa: { row: -1, col: 1 }, // ↗️
      alex_pablo: { row: 0, col: 1 }, // →
      alex_cere: { row: 1, col: 1 }, // ↘️
      alex_rivas: { row: 1, col: 0 }, // ↓
      chema_alex: { row: 0, col: -1 }, // ←
      chema_chema: { row: -1, col: -1 }, // ↖️
      chema_rafa: { row: -1, col: 0 }, // ↑
      chema_pablo: { row: -1, col: 1 }, // ↗️
      chema_cere: { row: 0, col: 1 }, // →
      chema_rivas: { row: 1, col: 1 }, // ↘️
      rafa_alex: { row: 1, col: -1 }, // ↙️
      rafa_chema: { row: 0, col: -1 }, // ←
      rafa_rafa: { row: -1, col: -1 }, // ↖️
      rafa_pablo: { row: -1, col: 0 }, // ↑
      rafa_cere: { row: -1, col: 1 }, // ↗️
      rafa_rivas: { row: 0, col: 1 }, // →
      pablo_alex: { row: 1, col: 0 }, // ↓
      pablo_chema: { row: 1, col: -1 }, // ↙️
      pablo_rafa: { row: 0, col: -1 }, // ←
      pablo_pablo: { row: -1, col: -1 }, // ↖️
      pablo_cere: { row: -1, col: 0 }, // ↑
      pablo_rivas: { row: -1, col: 1 }, // ↗️
    };

    this.generateGrid();
    this.generateOutButton();
    this.chooseStartingPosition();
    this.generateSequence();
  }

  generateGrid() {
    this.grid = [];
    for (let row = 0; row < this.gridSize; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.gridSize; col++) {
        let cell = new Phaser.GameObjects.Image(
          this.scene,
          -150 + col * 60,
          -100 + row * 60,
          "button"
        )
          .setDisplaySize(50, 50)
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => {
            if (this.status === "ongoing") this.handleGridClick(row, col);
          });
        this.add(cell);
        cell.row = row;
        cell.col = col;
        this.grid[row][col] = cell;
      }
    }
  } // generateGrid

  generateOutButton() {
    this.button = new Phaser.GameObjects.Image(this.scene, 135, 0, "button")
      .setDisplaySize(100, 100)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.status === "ongoing") this.handleOutClick();
      });
    this.add(this.button);

    // Add level number text
    this.add(
      new Phaser.GameObjects.Text(this.scene, 135, 0, "OUT", {
        font: "28px Arial",
        color: "#000000",
        align: "center",
      }).setOrigin(0.5)
    );
  } // generateOutButton

  chooseStartingPosition() {
    // ensure starting position is in the inner square.
    const row = Phaser.Math.Between(1, this.gridSize - 2);
    const col = Phaser.Math.Between(1, this.gridSize - 2);
    this.currentPosition = { row, col };
    this.tintCell(row, col, 0x00ff00); // Green tint
  }

  generateSequence() {
    // list of possible sounds that can be heard
    const directions = Object.keys(this.pairsTable);
    const sequenceLength = Phaser.Math.Between(2, 5);
    this.sequence = Array.from({ length: sequenceLength }, () =>
      Phaser.Utils.Array.GetRandom(directions)
    );

    // The generated sequence can be used to pick the sounds that should
    // be played in a loop.
    this.soundTracks = this.sequence.map((k) => this.scene.sound.add(k));

    this.soundTracks.forEach((track, i) => {
      if (i === this.soundTracks.length - 1) {
        // último track, volvemos al principio
        track.on("complete", () => this.soundTracks[0].play({ delay: 1.25 }));
      } else {
        // vamos al siguiente
        track.on("complete", () =>
          this.soundTracks[i + 1].play({ delay: 0.2 })
        );
      }
    });

    console.log("Generated sequence:", this.sequence);
  }

  setActivePanel(isActive) {
    super.setActivePanel(isActive);
    if (isActive && this.status === "ongoing") {
      this.soundTracks[0].play();
    } else {
      this.scene.sound.stopAll();
    }
  } // setActivePanel

  /**
   * Handle click on any grid button.
   * @param {integer} row
   * @param {integer} col
   */
  handleGridClick(row, col) {
    const expectedPosition = this.getNextPosition();

    if (
      expectedPosition &&
      row === expectedPosition.row &&
      col === expectedPosition.col
    ) {
      this.advanceSequence(row, col);
    } else {
      this.completePanel(false);
    }
  } // handleGridClick

  /**
   * Handle click on OUT button.
   */
  handleOutClick() {
    const expectedPosition = this.getNextPosition();

    if (!expectedPosition) {
      // expected position was out of bounds, pressing this button is the right choice
      this.completePanel(true);
    } else {
      // there was an actual expected position, which we did not respect
      this.completePanel(false);
    }
  } // handleOutClick

  /**
   * Retrieve the next position in the sequence.
   */
  getNextPosition() {
    if (this.sequenceIndex >= this.sequence.length) return null;

    // compute the next offset to apply from the current position
    const offset = this.pairsTable[this.sequence[this.sequenceIndex]];
    if (!offset) return null;

    const nextRow = this.currentPosition.row + offset.row;
    const nextCol = this.currentPosition.col + offset.col;

    if (
      nextRow < 0 ||
      nextRow >= this.gridSize ||
      nextCol < 0 ||
      nextCol >= this.gridSize
    ) {
      return null;
    }

    return { row: nextRow, col: nextCol };
  } // getNextPosition

  advanceSequence(row, col) {
    if (row !== undefined && col !== undefined) {
      // tint cell with the default color
      this.tintCell(
        this.currentPosition.row,
        this.currentPosition.col,
        0xffffff
      ); // Reset tint
      // tint new cell with success color
      this.tintCell(row, col, 0x00ff00); // Tint green
      // and update the new position
      this.currentPosition = { row, col };
    } else {
      this.completePanel(true);
    }

    // advance sequence to next interaction
    this.sequenceIndex++;

    // sequence has been fully completed
    if (this.sequenceIndex >= this.sequence.length) {
      this.completePanel(true);
    }
  } // advanceSequence

  tintCell(row, col, color) {
    const cell = this.grid[row][col];
    cell.setTint(color);
  } // tintCell

  completePanel(success) {
    const color = success ? 0x00ff00 : 0xff0000;
    for (let row of this.grid) {
      for (let cell of row) {
        cell.setTint(color).disableInteractive(true);
      }
    }
    this.button.setTint(color).disableInteractive(true);
    this.resetSoundTracks();
    super.completePanel(success);
  } // completePanel

  resetSoundTracks() {
    // destroy all available soundtracks
    //this.soundTracks.forEach((track) => track.destroy());
    this.scene.sound.stopAll();
  } // resetSoundTracks
} // GridPanel
