/*
    生成游戏场景，开始游戏 ---->
*/

const { ccclass } = cc._decorator;

@ccclass
export default class Games extends cc.Component {

    protected onLoad(): void {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;

    }

}
