phina.globalize(); // phina.jsがこれで使えるようになります。

// こんな感じで画像や音のファイルを指定します
let ASSETS = {
    image:{
        white:"img/planeship/white.png",
        black:"img/planeship/black.png",
        missile:"img/planeship/missile.png",
        bg:"img/planeship/sky.jpg"
    }
};

let WHITE_SPEED = 5;
let BLACK_SPEED = 3;
let MAX_SHOOT_COUNT = 3;
let SHOOT_INTERVAL_FRAME = 5;
let BLACK_HP = 1;
let WHITE_HP = 50;

let enemy;
let player;
let playerMissileGroup;
let enemyMissileGroup;
let whiteHpLabel;
let blackHpLabel; 
// phinaではこうやってClassを定義します
// Classよくわからんって人は、「ここで画面（Scene）を作ってる」とおぼえましょう
// ゲーム業界では画面のことをSceneと呼びます。スタート画面、ゲームプレイの画面、メニュー画面など
// DisplaySceneという「画面全体のボス」から、子供のGameSceneという「ゲームプレイ画面」を作りました
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function(app) { // ここはコンストラクタです。要は一番最初に一回だけやる処理のこと。
    this.superInit(); // 親クラス（DisplayScene）のコンストラクタを呼んでます。

    this.backgroundColor = "#4169e1";

    playerMissileGroup = DisplayElement().addChildTo(this);
    enemyMissileGroup = DisplayElement().addChildTo(this);
    this.playergroup = DisplayElement().addChildTo(this);
    this.enemygroup = DisplayElement().addChildTo(this);
    // こんな感じで、飛行機オブジェクトを作って、画面に配置します。
    // WHITE
    player = White(this).addChildTo(this.playergroup);
    // BLACK
    enemy = Black(this).addChildTo(this.enemygroup);

    // BLACKとWHITEのHPを設定
    this.whiteHp = WHITE_HP;
    this.blackHp = BLACK_HP;

    // BLACKとWHITEのHPを表示
    this.whiteHpLabel = hpLabel("white", this.whiteHp, 330, 600).addChildTo(this);
    this.blackHpLabel = hpLabel("black", this.blackHp, 330, 100).addChildTo(this);
  },  // ここのカンマ忘れずに。MainSceneの中のinitとupdateです。
  // Scratchでいうと、「ずっと」です
  update:function(app) {
    const key = app.keyboard;
    if (key.getKey("space")) {
      Missile(player.x, player.y,this.blackHpLabel).addChildTo(playerMissileGroup);
    }
    this.hitTestMissileToPlayer();
  },
  hitTestMissileToPlayer:function() {
    playerMissileGroup.children.forEach(missile => {
      this.enemygroup.children.forEach(enemy => {
        if (missile.hitTestElement(enemy)) {
          this.blackHp -= 1;
          missile.remove();
          if (this.blackHp === 0) {
            enemy.remove();
          }
        }
      })
    })
  }
});

phina.define("BackGround", {
  superClass:"DisplayElement",
  init:function() {
    this.superInit();
    let bg = Sprite("bg", 1280, 1920).addChildTo(this);

  },
  update:function() {

  }
});

phina.define("White", {
    superClass:"Sprite",
    init:function(scene) {
        this.superInit("white", 48, 48);
        this.x = scene.gridX.center();
        this.y = scene.gridY.center();
        this.blackHpLabel = scene.blackHpLabel;
    },
    update:function(app) {
        const key = app.keyboard;
        if (key.getKey("right")) { // rightボタンが押されたらTrueになります
            this.x += WHITE_SPEED;
        }
        if (key.getKey("left")) { // leftボタンが押されたらTrueになります
            this.x += -WHITE_SPEED;
        }
    }
});

phina.define("Black", {
    superClass:"Sprite",
    init:function(scene) {
        this.superInit("black", 146, 96);
        this.x = scene.gridX.center();
        this.y = scene.gridY.span(4);
        this.scaleY *= -1; // Y方向の"大きさ"を逆にすると見た目が逆になります。
        this.speed = BLACK_SPEED;
        this.tweener.clear()
                    .call(function() {
                      this.shot();
                    }, this)
                    .wait(600)
                    .setLoop(true);
    },
    shot:function() {
        EnemyMissile(this.x, this.y).addChildTo(this);
    },
    update:function() {
        if (this.x < 200 || this.x > 600) {
            this.speed *= -1;
        }
        this.x += this.speed;
    }
});

phina.define("Missile", {
  superClass:"Sprite",
  init:function(x, y, hpLabel) {
      this.superInit("missile", 63, 19);
      this.x = x;
      this.y = y - 20;
      this.setRotation(90);
      this.physical.velocity.y = -5;
      this.hpLabel = hpLabel;
  },
  update:function() {
    if (this.top < 0) {
      this.remove();
    }
    /*
    if (this.hitTestElement(enemy)) {
      this.hpLabel.hp -= 1;
      this.hpLabel.text = "black:" + this.hpLabel.hp;
      if (this.hpLabel.hp === 0) {
        enemy.remove();
      }
      this.remove();
    }
    */
  }
});

phina.define("EnemyMissile", {
  superClass:"Sprite",
  init:function(x, y) {
    this.superInit("missile", 63, 19);
    this.x = x;
    this.y = y + 20;
    this.setRotation(-90);
    this.physical.velocity.y = 5;

  },
  update:function() {
    if (this.top > 900) {
      this.remove();
    }
    if (this.hitTestElement(player)) {
      this.remove();
    }
  }
});


phina.define("hpLabel", {
  superClass:"Label",
  init:function(name, hp, x, y) {
      this.superInit(name + ":" + hp, 50,50);
      this.x = x;
      this.y = y;
      this.hp = hp;
      this.name = name;
  },
  decreaseHp:function(damage) {
      this.hp -= damage;
  },
  update:function() {
    this.text = this.name + ":" + this.hp;
  }
});


// ここがゲームスタートの入り口です
// 今はGameSceneという画面が１つあるだけなので、ただ画面が表示されるだけです。
phina.main(function() {
  var app = GameApp({
    startLabel: 'main',  // 色んな画面を増やしたいときはここに追加していきます。そのうちやりましょう。
    assets: ASSETS,       // アセット読み込み
  });
  app.run();
});