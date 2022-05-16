import * as Near  from "../near.js";

export class MainMenu extends Phaser.Scene {
    constructor(){
        super("MainMenu");
    }
    preload(){
        this.load.image("background", "../sources/sprites/background.png");
        this.load.image("floor", "../sources/sprites/floor.png");
        this.load.image("logo", "../sources/sprites/Logo.png");
        this.load.image("button", "../sources/sprites/Button.png");
    }
    create(){
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background").setScale(3).setOrigin(0);
        this.floor = this.add.tileSprite(this.game.config.width / 2, this.game.config.height, this.game.config.width, 40, "floor").setOrigin(0.5, 1).setScale(3);
        this.add.sprite(this.game.config.width / 2, 100, "logo").setScale(3);

        var account = Near.GetAccountId();
        
        if(account != ""){
            this.scene.start("game");
        }

        new Button(this.game.config.width / 2, 600, 5, "button", "Connect", this, ()=>{ Near.Login(); }, null, {fontSize: 45});
    }
    update(){
        this.background.tilePositionX += 0.0625;
        this.floor.tilePositionX += 0.5;
    }
}
export class Button{
    constructor(x, y, scale, img, label, scene, downCallback, fontStyle) {
        this.buttonResult = scene.add.container(x, y).setScrollFactor(0);

        this.button = scene.add.sprite(0,0, img)
        .setScale(scale)
        .setInteractive()
        .on("pointerdown", downCallback)
        this.buttonResult.add(this.button)

        if(label !== null){
            this.text = scene.add.text(0, 0, label)
            .setOrigin(0.5)
            .setStyle(fontStyle)
            .setPadding({ left: 0, right: 0, top: 0, bottom: 15 });
            this.buttonResult.add(this.text);
        }
    }
}