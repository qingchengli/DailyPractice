// 三个阶段状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise{
    constructor(excutor) {
        // 首先定义三个属性,分别对应当前状态status, 成功返回值value, 失败reason
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        // 将异步任务保存起来
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        // 定义两个回调函数
        // 成功回调
        let resolve = (value) => {
            // 判断是否是PENDING状态,因为promise是单向的
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        // 失败回调
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        // 执行传入函数,有两个参数分别对应resolve和reject,因为可能会失败,故将其放入try...catch中
        try {
            excutor(resolve, reject)
        } catch(error) {
            // 如果执行函数失败,则直接调用reject函数
            reject(error)
        }

    }
    // 定义then函数,模拟两个参数,一个是成功回调,一个是失败回调
    then(onFulfilled, onRejected) {
        // fulfilled
        if (this.status === FULFILLED) {
            onFulfilled(this.value)
        }
        if (this.status === REJECTED) {
            onRejected(this.reason)
        }
        // 如果执行函数是异步函数,则在执行then函数时,status仍为pending,故将异步任务暂时保存起来,在状态改变后再执行
        if (this.status === PENDING) {
            // 使用箭头函数绑定this与then一致
            this.onResolvedCallbacks.push(() => {
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason)
            })
        }
    }
}


new Promise((resolve, reject) => {
    console.log('开始')
    // resolve(('成功'))
    setTimeout(() => {
        resolve('成功')
    }, 2000)
}).then(res => {
    console.log(res)
})
// .then(1,2).then(() => {
//     return 'ke'
// }, '').then(res => {
//     console.log(res)
// }).then(res => {})