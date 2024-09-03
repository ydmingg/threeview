import { ThreeView } from '../index'

const container = document.getElementById('app') as HTMLDivElement
const { width, height} = { width:container.clientWidth, height:container.clientHeight }

const url = [
    'http://192.168.5.235:8077/static/models/scene_collision.glb',
    '../../static/models/suzanne.gltf',
]
const data = {
    module: {
        scene: url[0],
        word: '../../static/models/scene_desk_obj.glb'

    },
    textures: [
        '../../static/boards/1.png',
        '../../static/boards/2.png',
        '../../static/boards/3.jpg',
        '../../static/boards/4.jpg',
        '../../static/boards/5.png',
        '../../static/boards/6.png',
        '../../static/boards/7.png',
        '../../static/boards/8.jpg',
        '../../static/boards/9.jpg',
        '../../static/boards/10.png',
    ],
    audio: {
        background: '../../static/audio/01.m4a',
    },


}




// 实例化
const threeView = new ThreeView(container, {
    width,
    height
})



// 渲染
threeView.setData(data)

