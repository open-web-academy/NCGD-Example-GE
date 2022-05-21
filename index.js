import * as MainMenu from "./scenes/MainMenuScene";
import * as Game from "./scenes/gameScene.js";

const mainMenu = MainMenu.MainMenu;
const game = Game.GameScene;

const config = {
    parent: 'gameContainer',
    scale:{
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics:{
        default: "arcade",
        arcade:{
            gravity:{
                y: 500
            },
            debug: false,
        }
    },
    width: 432,
    height: 768,
    scene: [mainMenu, game],
    pixelArt: true,
};

new Phaser.Game(config);
