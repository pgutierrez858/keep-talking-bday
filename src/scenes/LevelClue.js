export class LevelClue extends Phaser.Scene {
  constructor() {
    super({ key: "LevelClue" });
  }

  create() {
    this.plugins.get("rexcrtpipelineplugin").add(this.cameras.main, {
      warpX: 0.25,
      warpY: 0.25,
      scanLineStrength: 0.2,
      scanLineWidth: 1024,
    });
    // Add clue text
    if (!!this.unlockedText) {
      this.clueText = this.add
        .text(
          400,
          300,
          this.success ? this.unlockedText : "Lamentable rendimiento...",
          {
            fontSize: "30px",
            color: "#ffffff",
          }
        )
        .setOrigin(0.5);
    }

    // Add clue text
    if (!!this.unlockedImage) {
      this.clueImage = this.add
        .image(400, 300, this.unlockedImage)
        .setOrigin(0.5)
        .setScale(1.1, 1.1);
    }

    const rightArrow = this.add
      .image(747, 300, "arrowRight")
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

  init({ unlockedText, unlockedImage, level, success }) {
    this.unlockedText = unlockedText;
    this.unlockedImage = unlockedImage;
    this.level = level;
    this.success = success;
  } // init
} // LevelClue
