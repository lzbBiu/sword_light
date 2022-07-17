// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        flash: {
            // ATTRIBUTES:
            default: null,
            type: cc.Material,
        },
        flashEnd: {
            // ATTRIBUTES:
            default: null,
            type: cc.Material,
        },
        hitEffect: {
            // ATTRIBUTES:
            default: null,
            type: cc.Prefab,
        },
        sprite: {
            default: null,
            type: cc.Node,
        },
        player: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        this.camera = cc.find('Canvas/playerFollower/Main Camera');
        
    },

    start () {
        this.anim = this.player.getComponent(cc.Animation);
    },

    onCollisionEnter(other, self) {
        // 特效解决初始场景展示问题后进行开发
        const hitEffect = cc.instantiate(this.hitEffect);
        hitEffect.parent = this.player.parent;
        hitEffect.setPosition(this.player.x, this.player.y);
        this.node.getComponent(cc.AudioSource).play();
        this.sprite.getComponent(cc.Sprite).setMaterial(0, this.flash);
        this.camera.getComponent('Camera').setShake(3);
    },

    onCollisionExit() {
        this.sprite.getComponent(cc.Sprite).setMaterial(0, this.flashEnd);
        this.anim.play("playerHurt");
    }

    // update (dt) {},
});
