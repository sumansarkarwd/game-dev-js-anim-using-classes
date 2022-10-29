window.addEventListener("load", () => {
  /** @type {HTMLCanvasElement}  */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.height = 800;
  canvas.width = 500;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 1000;
      this.enemyTimer = 0;
      this.enemyTypes = ["worm", "ghost", "spider"];
    }
    update(deltaTime) {
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
        this.enemies = this.enemies.filter((obj) => !obj.markedForDeletion);
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => enemy.update(deltaTime));
    }
    draw() {
      this.enemies.forEach((enemy) => enemy.draw(this.ctx));
    }
    #addNewEnemy() {
      const enemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (enemy === "worm") {
        this.enemies.push(new Worm(this));
      }
      if (enemy === "ghost") {
        this.enemies.push(new Ghost(this));
      }
      if (enemy === "spider") {
        this.enemies.push(new Spider(this));
      }
      this.enemies.sort((e1, e2) => {
        return e1.y - e2.y;
      });
      console.log(this.enemies);
    }
  }
  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) {
          this.frameX = 0;
        } else {
          this.frameX++;
        }
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
    draw(ctx) {
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.x = game.width;
      this.y = Math.random() * game.height * 0.6;
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.image = ghost;
      this.vx = Math.random() * 0.1 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = "0.7";
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 174;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.image = spider;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.maxGoDown = Math.random() * 200 + 100;
    }
    update(deltaTime) {
      super.update(deltaTime);
      if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
      this.y += this.vy * deltaTime;
      if (this.y > this.maxGoDown) this.vy *= -1;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width * 0.5, 0);
      ctx.lineTo(this.x + this.width * 0.5, this.y + 10);
      ctx.stroke();
      super.draw(ctx);
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);

  let lastTime = 1;
  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(animate);
  }

  animate(0);
});
