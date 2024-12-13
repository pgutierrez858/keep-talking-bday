export class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Set up progress bar graphics
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 25, width / 2, 50);

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        font: "20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    const percentText = this.add
      .text(width / 2, height / 2, "0%", {
        font: "18px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    // Update progress bar during asset loading
    this.load.on("progress", (value) => {
      percentText.setText(`${Math.floor(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0x0000ff, 1);
      progressBar.fillRect(
        width / 4 + 10,
        height / 2 - 15,
        (width / 2 - 20) * value,
        30
      );
    });

    // Remove progress bar and texts once loading is complete
    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Load assets
    this.load.image("button", "assets/ui/buttonFrame.png");
    this.load.image("arrowLeft", "assets/ui/arrowLeft.png");
    this.load.image("arrowRight", "assets/ui/arrowRight.png");
    this.load.image("panelFrame", "assets/ui/panelFrame.png");
    for (let i = 1; i <= 27; i++) {
      this.load.image(`characters-${i}`, `/assets/buttons/characters/${i}.png`);
      this.load.image(`minecraft-${i}`, `/assets/buttons/minecraft/${i}.png`);
    }

    const soundKeys = ["alex", "chema", "rafa", "pablo"].flatMap((voice) =>
      ["alex", "chema", "rafa", "pablo", "cere", "rivas"].map(
        (name) => `${voice}_${name}`
      )
    );
    soundKeys.forEach((sk) => this.load.audio(sk, `/assets/sounds/${sk}.mp3`));
  }

  create() {
    // Start the main game scene
    this.scene.start("LevelSelection");
  }
} // Boot
