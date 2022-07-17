// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Blast extends cc.Component {

    @property(cc.Prefab)
    dustPrefab: cc.Prefab = null;

    private volume: number = 1;

    private collisionsNumber = 3;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        setTimeout(() => {
            if(this.node != null){
            this.node.destroy()}
        }, 3000);
    }

    group1(){
        this.node.group = "heroHitBox"
        if(this.node.y < 50){
            var effect = cc.instantiate(this.dustPrefab)
            effect.parent= this.node.parent
            effect.scaleX = this.node.scaleX
            effect.x = this.node.x
            effect.y = 0;
        }
        
        //特效音量递减 (Decrease in Effect volume)
        this.volume -= 0.07
        this.node.getComponent(cc.AudioSource).volume = this.volume
        this.node.getComponent(cc.AudioSource).play()
    }

    group2(){
        this.node.group = "default"
    }

    onCollisionEnter(){
        this.collisionsNumber -= 1
    }

    update (dt) {
        this.node.x += this.node.scaleX * 400 * dt
        
        if(this.collisionsNumber <= 0){
            this.node.destroy()
        }
    }
}

