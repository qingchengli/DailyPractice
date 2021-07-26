// 总是会遇见一些频繁的事件触发
// window 的 resize、scroll
// mousedown、mousemove
// keyup、keydown
// 如果是复杂的回调函数或是 ajax 请求？假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。
// 一般解决这种情况的方法: 1.防抖, 2.节流

var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    console.log(e)
    container.innerHTML = count++;
};
// 加入防抖
function debounce(func, wait) {
    var timer
    return function() {
        // 改变this指向,因为,div.function调用是,function是指向对象的,但settimeout的func的this是指向window的
        let _this = this
        // 获取调用时的传参
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            // 使用apply而不是使用call的原因就是arguments传入是数组
            func.apply(_this, args)
        }, wait);
    }
}
// 加入防抖,需求是立即执行,但是需要间隔一段时间才能再次出发,此时wait是间隔时间
function debounce2(func, wait, immediate) {
    var timer
    return function() {
        // 改变this指向,因为,div.function调用是,function是指向对象的,但settimeout的func的this是指向window的
        let _this = this
        // 获取调用时的传参(注,arguments实际是类数组对象)
        let args = arguments
        clearTimeout(timer)
        if (immediate) {
            let notCD = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait);
            if (notCD) {
                func.apply(_this,arguments)
            }

        } else {
            timer = setTimeout(() => {
                // 使用apply而不是使用call的原因就是arguments传入是数组
                func.apply(_this, arguments)
            }, wait);
        }
    }
}
// 还缺少一个取消逻辑
// 绑定事件
// container.onmousemove = debounce2(getUserAction, 2000, true);