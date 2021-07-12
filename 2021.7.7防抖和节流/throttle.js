// 总是会遇见一些频繁的事件触发
// window 的 resize、scroll
// mousedown、mousemove
// keyup、keydown
// 如果是复杂的回调函数或是 ajax 请求？假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。
// 一般解决这种情况的方法: 1.防抖, 2.节流
// 防抖: 不管触发多少次,只会在停止后触发一次;
// 节流: 触发一次后只能间隔多少时间才能再次触发

var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    console.log(e)
    container.innerHTML = count++;
};
// 简洁版节流函数
function throttle(func, wait) {
    // 利用时间戳
    var initTime = 0
    return function() {
        let args = arguments
        let _this = this
        // 利用隐式转换,将时间对象变成时间戳
        let now = +new Date()
        if (now - initTime > wait) {
            func.apply(_this, args)
        }
        initTime = now
    }
}
// 花里胡哨版(功能强化版)待完善

// 绑定事件
container.onmousemove = throttle(getUserAction, 1000);