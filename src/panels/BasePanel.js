export class BasePanel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, onPanelCompleted) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.status = "ongoing";
    this.onPanelCompleted = onPanelCompleted;
  }

  setActivePanel(isActive) {
    this.setVisible(isActive);
  } // setActivePanel

  completePanel(success) {
    this.status = success ? "success" : "failure";
    this.onPanelCompleted();
  } // completePanel
} // BasePanel
