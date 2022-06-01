import * as Near  from "../near.js";
import * as MainMenu from "./MainMenuScene.js";

export class GameScene extends Phaser.Scene {
    gameOver = false;
    isLeaderboard = false;
    pipes = [];
    score = 0;

    constructor(){
        super("game");
    }
    preload(){
        this.load.image("background", "../sources/sprites/background.png");
        this.load.image("floor", "../sources/sprites/floor.png");
        this.load.image("pipe_up", "../sources/sprites/pipe_up.png");
        this.load.image("pipe_down", "../sources/sprites/pipe_down.png");
        this.load.spritesheet("flappy", "../sources/sprites/flappy.png", {frameWidth: 17,     frameHeight: 14});
        this.load.image("gameOver", "../sources/sprites/GameOver.png");
        this.load.image("board", "../sources/sprites/Board.png");
        this.load.image("button", "../sources/sprites/Button.png");
    }
    async create(){
        //http://localhost:8000/?transactionHashes=Cfoo6bT12qZj6SWiYwwUCKbzwZMEVJm3eMhyz4P64cP9
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background").setScale(3).setOrigin(0);
        this.floor = this.add.tileSprite(this.game.config.width / 2, this.game.config.height, this.game.config.width, 40, "floor").setOrigin(0.5,1).setScale(3);
        this.floor.depth = 1;

        let value = await Near.GetInfoByURL();
        if(value != null){
            this.isLeaderboard = true;
            new Board(this, JSON.parse(value.receipts_outcome[0].outcome.logs[0]).puntuacion);
            return;
        }

        this.flappy = this.physics.add.image(this.game.config.width / 2, this.game.config.height / 2, "flappy", 0).setScale(3).setOrigin(0.5).setCollideWorldBounds(true);
        this.physics.add.existing(this.floor, true);
        
        this.time.addEvent({
            callback: this.spawnPipe,
            callbackScope: this,
            delay: 2500,
            loop: true
        });
            
        this.input.on("pointerdown", () => { if(!this.gameOver) this.flappy.setVelocityY(-250); })
        this.physics.add.overlap(this.flappy, this.floor, this.GameOver);
        this.scoreText = this.add.text(this.game.config.width / 2, 50, "0", {fontSize: 120}).setOrigin(0.5);
        this.scoreText.depth = 2;    
    }
    update(){
        if(!this.isLeaderboard){
            if(!this.gameOver){
                this.background.tilePositionX += 0.25 / 4;
                this.floor.tilePositionX += 0.5;
                this.pipes.forEach(pipe => {
                    pipe.update();
                });
            } else{
                this.flappy.body.stop();
                this.flappy.body.setAllowGravity(false);
            }
        }
    }
    spawnPipe(){
        if(!this.gameOver)
            this.pipes.push(new Pipe(this));
    }
    AddScore(){
        this.score++;
        this.scoreText.setText(this.score.toString());
    }
    GameOver = async() => {
        if(this.gameOver)
            return;
        this.gameOver = true;
        this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 200, "gameOver").setScale(3);
        let bestScore = await Near.ObtenerPuntuacion();
        console.log(bestScore)
        if(this.score > bestScore)
            await Near.GuardarPuntuacion(this.score);
        new Board(this, bestScore);
    }
    Restart = () => {
        this.isLeaderboard = this.gameOver = false;
        this.score = 0;
        this.scene.restart()
    }
}
class Board {
    constructor(context, bestScore){
        this.CreateBoard(context, bestScore);
    }
    
    async CreateBoard(context, bestScore){
        let scores = await Near.ObtenerPuntuaciones();
        scores.sort((a, b) => {  return b.puntuacion - a.puntuacion; } );
        this.container = context.add.container(context.sys.game.scale.gameSize.width / 2, context.sys.game.scale.gameSize.height / 2);
        this.container.add(context.add.sprite(0,0, "board").setScale(3));
        this.container.add(context.add.text(75, -45, bestScore, {fontFamily: "bit", fontSize: 45}))
        console.log(scores.filter(user => user.id_jugador == Near.GetAccountId())[0].puntuacion);
        this.container.add(context.add.text(75, 15, scores.filter(user => user.id_jugador == Near.GetAccountId())[0].puntuacion, {fontFamily: "bit", fontSize: 45}))

        new MainMenu.Button(context.game.config.width / 2, context.game.config.height / 2 + 120, 3, "button", "Restart", context, context.Restart);
        scores.forEach((element, index) => {
            this.container.add(context.add.text(-135, -60 + index * 20, `${element.id_jugador}\t${element.puntuacion}`, { fontSize: 12 }));
        });
    }
}
class Pipe {
    passed = false;
    constructor(context){
        this.context = context;
        let height = Phaser.Math.Between(-200, 0);
    
        this.pipeDown = context.physics.add.sprite(context.sys.game.scale.gameSize.width, context.sys.game.scale.gameSize.height + height + 75, "pipe_down").setScale(3).setOrigin(0, 1);
        this.pipeDown.body.setAllowGravity(false);

        this.pipeUp = context.physics.add.sprite(context.sys.game.scale.gameSize.width, height - 80, "pipe_up").setScale(3).setOrigin(0, 0);
        this.pipeUp.body.setAllowGravity(false);

        this.goal = context.add.zone(context.sys.game.scale.gameSize.width + 100, context.sys.game.scale.gameSize.height / 2 + height + 20, 20, 100).setRectangleDropZone(20, 100);
        context.physics.world.enable(this.goal);
        this.goal.body.setAllowGravity(false);

        context.physics.add.overlap(context.flappy, this.goal, this.addScore)

        context.physics.add.overlap(context.flappy, [this.pipeDown, this.pipeUp], context.GameOver);
    
    }
    addScore = () => {
        if(!this.passed){
            this.context.AddScore();
            this.passed = true;
        }
    }
    update(){
        this.context.physics.world.collide(this.context.flappy, [this.pipeDown, this.pipeUp]);
        this.pipeDown.x -= 1.5; 
        this.pipeUp.x -= 1.5;
        this.goal.x -= 1.5;
        if(this.pipeDown.x < 0 - this.pipeDown.width * 3){
            this.pipeDown.destroy();
            this.pipeUp.destroy();
            this.goal.destroy();
        }
    }
}
