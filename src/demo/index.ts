import { ThreeView } from '../index'

const container = document.getElementById('app') as HTMLDivElement
const { width, height} = { width:container.clientWidth, height:container.clientHeight }
const url = {
    scene: '../../static/models/scene_collision.glb',
    word: '../../static/models/scene_desk_obj.glb'
}

// 实例化
const threeView = new ThreeView(container, {
    width,
    height
})

// 渲染
// threeView.setData({
//     scene: url.scene,
//     word: url.word
// })

