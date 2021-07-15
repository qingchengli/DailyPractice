// 三个阶段状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
// resolvePromise是什么？：这其实是官方Promise/A+的需求。因为你的then可以返回任何职，当然包括Promise对象，而如果是Promise对象，我们就需要将他拆解，直到它不是一个Promise对象，取其中的值。
// 个人理解这个方法就是处理向后传递的参数,首先避免返回正在执行的promise自身,其次将Promise类型的返回值处理成普通类型的数值再向后传递
// promise2 then执行后返回的新Promise对象, x, then函数执行后的返回值, resolve, promise2的resolve,用来改变then后传递的resolve的值,reject同理
function resolvePromise(promise2, x, resolve, reject) {
    // 首先判断promise2和返回值x的关系,避免返回promise2本身
    if (x === promise2) {
        return reject(new TypeError('循环引用'))
    }
    // 如果x是对象或者funciton,则判断其有可能是promise类型
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 取出x的then属性(注: 此时then调用环境变成全局了,所以需要用call改变then里的this指回x: 为什么要取出then? 因为要判断then是否是fucntion,因为可能为{})
        //如果x不是null，是对象或者方法
        //为了判断resolve过的就不用再reject了，（比如有reject和resolve的时候）(不是很理解)
        let called
        // 为了防止then执行的时候返回异常,比如说then虽然是function,但并不是promise里的then,有可能会抛错
        try {
            let then = x.then
            if (typeof then === 'function') {
                // 如果是function,则默认它是promise的then,传入onFulfilled和onRejectd
                then.call(x, y => {
                    // (不是很理解called的作用)
                    if (called) return
                    called = true
                    // 使用递归,将返回值一直处理成非promise,将两个改变this.value和this.reason的方法继续向下传递
                    resolvePromise(promise2, y, resolve, reject)
                }, error => {
                    if (called) return
                    called = true
                    reject(error)
                })
            } else {
                // 如果只是非Promise类型,则直接将x作为this.value
                resolve(x)
            }
        } catch (error) {
            if (called) return;
            called = true
            reject(error)
        }
    } else {
        // 如果是基本类型,则直接处理
        resolve(x)
    }
}

class Promise {
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
        } catch (error) {
            // 如果执行函数失败,则直接调用reject函数
            reject(error)
        }

    }
    // 定义then函数,模拟两个参数,一个是成功回调,一个是失败回调
    then(onFulfilled, onRejected) {
        // 因为要把值传递给下一个then,当传入的两个参数不是函数的时候,则需要我们自己创建一个可以传递值得函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => { return v }
        // 错误也要被后面捕获,所以要抛错,不然在then之后会被resolve捕获
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
        // 返回新的Pomise
        let promise2 = new Promise((resolve, reject) => {
            // fulfilled
            if (this.status === FULFILLED) {
                // 因为then是异步任务,不能阻碍同步代码的执行,这里使用setTimeout模拟,但setTimeout并不能完全模拟,因为setTimeout是宏任务,而Pomise的then实际上是微任务
                // 使用箭头函数包裹避免this指针被改变
                setTimeout(() => {
                    // 考虑到onFulfilled也会出错,采用try..catch
                    // 注: 此时已经执行了onFulfilled
                    try {
                        let x = onFulfilled(this.value)
                        // 传入promise2主要是为了识别返回值是否是promise2,避免形成死循环
                        // 传入resolve和reject,在执行后面then的时候已经难道promise2的resolve和reject处理过的值了, 既promise2的this.value
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0)
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0)
            }
            // 如果执行函数是异步函数,则在执行then函数时,status仍为pending,故将异步任务暂时保存起来,在状态改变后再执行
            if (this.status === PENDING) {
                // 使用箭头函数绑定this与then一致
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolve(promise2, x, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0);
                })
            }
        })
        // promise2在初始化的时候已经改变了要往后传递的this.value,所以在后续调用then时,已经可以获取到返回值了
        return promise2
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