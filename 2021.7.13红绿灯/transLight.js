// 思路就是利用promise的then结合setTimeout来实现延迟执行
// 后续扩展: a.实现html真正的红绿灯; b.实现倒计时功能

// 三个颜色函数
function red() {
    console.log('红灯停')
}
function yellow() {
    console.log('黄灯看')
}
function green() {
    console.log('绿灯行')
}

let timer = null
// 亮灯执行函数
function light(cb, ms) {
    return new Promise(resolve => {
        timer = setTimeout(() => {
            cb()
            resolve()
        }, ms);
    })
}

function step() {
    Promise.resolve().then(res => {
        return light(red, 1000)
    }).then(() => {
        return light(yellow, 6000)
    }).then(() => {
        return light(green, 6000)
    }).finally(() => {
        return step()
    })
}

step()

// clearTimeout(timer)