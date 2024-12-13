import { Boot } from "./scenes/Boot.js";
import { LevelClue } from "./scenes/LevelClue.js";
import { LevelSelection } from "./scenes/LevelSelection.js";
import { Panels } from "./scenes/Panels.js";

// Phaser 3 configuration and game initialization
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  scene: [Boot, LevelSelection, Panels, LevelClue],
};

new Phaser.Game(config);
