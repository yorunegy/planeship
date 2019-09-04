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