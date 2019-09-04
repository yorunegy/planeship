phina.globalize(); // phina.jsがこれで使えるようになります。

// こんな感じで画像や音のファイルを指定します
let ASSETS = {
    image:{
        white:"img/planeship/white.png",
        black:"img/planeship/black.png",
        missile:"img/planeship/missile.png"
    }
};

let WHITE_SPEED = 5;
let BLACK_SPEED = 3;
let MAX_SHOOT_COUNT = 3;
let SHOOT_INTERVAL_FRAME = 5;
// phinaではこうやってClassを定義します
// Classよくわからんって人は、「ここで画面（Scene）を作ってる」とおぼえましょう
// ゲーム業界では画面のことをSceneと呼びます。スタート画面、ゲームプレイの画面、メニュー画面など
// DisplaySceneという「画面全体のボス」から、子供のGameSceneという「ゲームプレイ画面」を作りました
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function(app) { // ここはコンストラクタです。要は一番最初に一回だけやる処理のこと。
    this.superInit(); // 親クラス（DisplayScene）のコンストラクタを呼んでます。

    this.backgroundColor = "#4682b4";
    // こんな感じで、飛行機オブジェクトを作って、画面に配置します。
    // WHITE
    this.white = White(this).addChildTo(this);

    // BLACK
    this.black = Black(app, this).addChildTo(this);


  },  // ここのカンマ忘れずに。MainSceneの中のinitとupdateです。
  // Scratchでいうと、「ずっと」です
  update:function(app) {
      const key = app.keyboard; // キーボードの状況が入った箱を持ってきます
      let white = this.white;
      if (key.getKey("space")) {
        Missile(white.x, white.y, this.black, app.frame).addChildTo(this);
      }

      let black = this.black;
      EnemyMissile(black.x, black.y, this.white).addChildTo(this);
  },
});

phina.define("White", {
    superClass:"Sprite",
    init:function(scene) {
        this.superInit("white", 48, 48);
        this.x = scene.gridX.center();
        this.y = scene.gridY.center();
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
    init:function(app, scene) {
        this.superInit("black", 146, 96);
        this.x = scene.gridX.center();
        this.y = scene.gridY.span(4);
        this.scaleY *= -1; // Y方向の"大きさ"を逆にすると見た目が逆になります。
        this.speed = BLACK_SPEED;
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
  init:function(x, y, black, frame) {
      this.superInit("missile", 63, 19);
      this.x = x;
      this.y = y - 20;
      this.setRotation(90);
      this.physical.velocity.y = -5;
      this.black = black;
  },
  update:function() {
    if (this.top < 0) {
      this.remove();
    }
    if (this.hitTestElement(this.black)) {
      this.remove();
    }
  }
});

phina.define("EnemyMissile", {
  superClass:"Sprite",
  init:function(x, y, white) {
    this.superInit("missile", 63, 19);
    this.x = x;
    this.y = y + 20;
    this.setRotation(-90);
    this.physical.velocity.y = 5;
    this.white = white;
  },
  update:function() {
    if (this.top > 900) {
      this.remove();
    }
    if (this.hitTestElement(this.white)) {
      this.remove();
    }
  }
})



// ここがゲームスタートの入り口です
// 今はGameSceneという画面が１つあるだけなので、ただ画面が表示されるだけです。
phina.main(function() {
  var app = GameApp({
    startLabel: 'main',  // 色んな画面を増やしたいときはここに追加していきます。そのうちやりましょう。
    assets: ASSETS,       // アセット読み込み
  });
  app.run();
});