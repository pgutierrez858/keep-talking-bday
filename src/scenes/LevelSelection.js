const levelData = [
  {
    timeRemaining: 120,
    maxWrongPanels: 2,
    numPanels: 3,
    availablePanels: ["characters"],
    unlockedText: "puzle1",
    level: 1,
  },
  {
    timeRemaining: 110,
    maxWrongPanels: 1,
    numPanels: 4,
    availablePanels: ["minecraft"],
    unlockedText: "Misiles disparados con éxito.",
    level: 2,
  },
  {
    timeRemaining: 100,
    maxWrongPanels: 0,
    numPanels: 4,
    availablePanels: ["characters", "minecraft"],
    unlockedText: "A menudo, lo mas sencillo es volver al principio.",
    level: 3,
  },
  {
    timeRemaining: 120,
    maxWrongPanels: 2,
    numPanels: 4,
    availablePanels: ["sounds"],
    unlockedText: "Imagen 'pruebas cumple'/puzle4.png",
    level: 4,
  },
  {
    timeRemaining: 120,
    maxWrongPanels: 1,
    numPanels: 4,
    availablePanels: ["characters", "minecraft", "sounds"],
    unlockedText: "Motores listos para la turbopropulsión.",
    level: 5,
  },
  {
    timeRemaining: 75,
    maxWrongPanels: 2,
    numPanels: 6,
    availablePanels: ["characters", "minecraft", "sounds"],
    unlockedText:
      "Enhorabuena por vuestro esfuerzo, pero esto no tiene premio.",
    level: 6,
  },
];

export class LevelSelection extends Phaser.Scene {
  constructor() {
    super({ key: "LevelSelection" });
  }

  create() {
    const levels = 6; // Total number of levels
    const columns = 3; // Number of columns in the grid
    const rows = 2; // Number of rows in the grid
    const buttonSize = 100; // Size of the button
    const padding = 20; // Padding between buttons
    const offsetX =
      (this.scale.width - (buttonSize * columns + padding * (columns - 1))) / 2; // Horizontal offset
    const offsetY =
      (this.scale.height - (buttonSize * rows + padding * (rows - 1))) / 2; // Vertical offset

    // Retrieve the last completed level from localStorage
    const lastLevelCompleted =
      parseInt(localStorage.getItem("lastLevelCompleted")) || 0;

    for (let i = 0; i < levels; i++) {
      const x = offsetX + (i % columns) * (buttonSize + padding);
      const y = offsetY + Math.floor(i / columns) * (buttonSize + padding);
      const level = i + 1;

      const isUnlocked = level <= lastLevelCompleted + 1;

      const button = this.add
        .image(x, y, "button")
        .setDisplaySize(buttonSize, buttonSize)
        .setInteractive({ useHandCursor: isUnlocked })
        .on("pointerdown", () => {
          if (isUnlocked) {
            this.startPanelsScene(level);
          }
        });

      // Apply tint or adjust opacity for dimmed effect
      if (!isUnlocked) {
        button.setTint(0x555555); // Darken the button to indicate it's locked
        button.disableInteractive(); // Prevent interaction
      }

      // Add level number text
      this.add
        .text(x, y, level, {
          font: "32px Arial",
          color: "#000000",
          align: "center",
        })
        .setOrigin(0.5);
    }
  }

  startPanelsScene(level) {
    this.scene.start("Panels", levelData[level - 1]);
  } // startPanelsScene
}
