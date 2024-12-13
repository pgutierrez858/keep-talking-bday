export class LevelClue extends Phaser.Scene {
  constructor() {
    super({ key: "LevelClue" });
  }

  create() {
    // Add clue text
    this.clueText = this.add
      .text(
        400,
        150,
        this.success ? this.unlockedText : "Lamentable rendimiento...",
        {
          fontSize: "30px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const rightArrow = this.add
      .image(750, 300, "arrowRight")
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(75, 75);

    rightArrow.on("pointerdown", () => {
      if (this.success) {
        const lastLevelCompleted = localStorage.getItem("lastLevelCompleted");
        localStorage.setItem(
          "lastLevelCompleted",
          Math.max(lastLevelCompleted, this.level)
        );
      }

      this.scene.start("LevelSelection");
    });
  } // create

  init({ unlockedText, level, success }) {
    this.unlockedText = unlockedText;
    this.level = level;
    this.success = success;
  } // init
} // LevelClue
