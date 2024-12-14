import { ColumnsPanel } from "../panels/ColumnsPanel.js";
import { GridPanel } from "../panels/GridPanel.js";

const formatTime = (seconds) => {
  if (seconds <= 0) return `0:00`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export class Panels extends Phaser.Scene {
  constructor() {
    super("Panels");
  }

  preload() {}

  init({
    timeRemaining,
    availablePanels,
    maxWrongPanels,
    numPanels,
    unlockedText,
    unlockedImage,
    level,
  }) {
    this.timeRemaining = timeRemaining;
    this.availablePanels = availablePanels;
    this.maxWrongPanels = maxWrongPanels;
    this.numPanels = numPanels;
    this.unlockedText = unlockedText;
    this.unlockedImage = unlockedImage;
    this.level = level;

    this.currentPanel = 0;
    this.wrongPanels = 0;
    this.panels = [];
  } // init

  create() {
    // Add panel frame
    this.add.image(400, 300, "panelFrame");

    // Add navigation arrows
    const leftArrow = this.add
      .image(50, 300, "arrowLeft")
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(75, 75);
    const rightArrow = this.add
      .image(750, 300, "arrowRight")
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(75, 75);

    leftArrow.on("pointerdown", () => this.switchPanel(-1));
    rightArrow.on("pointerdown", () => this.switchPanel(1));

    // Create multiple panels
    for (let i = 0; i < this.numPanels; i++) {
      const handlePanelCompleted = () => {
        this.checkGameOver();
      };

      let newPanel;
      const panelType = Phaser.Utils.Array.GetRandom(this.availablePanels);
      switch (panelType) {
        case "characters":
          newPanel = new ColumnsPanel(
            this,
            400,
            300,
            () => handlePanelCompleted(),
            "characters"
          );
          break;
        case "minecraft":
          newPanel = new ColumnsPanel(
            this,
            400,
            300,
            () => handlePanelCompleted(),
            "minecraft"
          );
          break;
        case "sounds":
          newPanel = new GridPanel(this, 400, 300, () =>
            handlePanelCompleted()
          );
          break;
      }
      this.panels.push(newPanel);
    }

    // Display the first panel
    this.panels.forEach(
      /**
       * @param {Phaser.GameObjects.Container} panel
       * @param {integer} index
       */
      (panel, index) => {
        panel.setActivePanel(index === this.currentPanel);
      }
    );
    this.panels[this.currentPanel].setActivePanel(true);

    // Add timer text
    this.timerText = this.add
      .text(400, 50, formatTime(this.timeRemaining), {
        fontSize: "30px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeRemaining--;
        this.timerText.setText(formatTime(this.timeRemaining));

        if (this.timeRemaining <= 0) {
          this.endGame(false);
        }
      },
      loop: true,
    });
  } // create

  update() {}

  tintPanel(panel, color) {
    panel.getChildren().forEach((child) => {
      child.setTint(color);
    });
  }

  switchPanel(direction) {
    this.panels[this.currentPanel].setVisible(false);
    this.panels[this.currentPanel].setActivePanel(false);
    this.currentPanel = Phaser.Math.Wrap(
      this.currentPanel + direction,
      0,
      this.panels.length
    );
    this.panels[this.currentPanel].setVisible(true);
    this.panels[this.currentPanel].setActivePanel(true);
  }

  checkGameOver() {
    let failed = 0;
    let ongoing = 0;
    let success = 0;
    this.panels.forEach((p) => {
      switch (p.status) {
        case "failure":
          failed++;
          break;
        case "ongoing":
          ongoing++;
          break;
        case "success":
          success++;
          break;
        default:
          break;
      }
    });
    if (failed > this.maxWrongPanels) {
      this.endGame(false);
    } else if (success + failed === this.numPanels) {
      this.endGame(true);
    }
  } // checkGameOver

  endGame(success) {
    this.sound.stopAll();
    this.scene.start("LevelClue", {
      unlockedText: this.unlockedText,
      level: this.level,
      success: success,
      unlockedImage: this.unlockedImage,
    });
  } // endGame
} // Panels
