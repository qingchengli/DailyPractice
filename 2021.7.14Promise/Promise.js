const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function resolvePromise(promise2,x,resolve,reject){
    //判断x和promise2之间的关系
    //因为promise2是上一个promise.then后的返回结果，所以如果相同，会导致下面的.then会是同一个promise2，一直都是，没有尽头
    if(x === promise2){//相当于promise.then之后return了自己，因为then会等待return后的promise，导致自己等待自己，一直处于等待
      return reject(new TypeError('循环引用'))
    }
    //如果x不是null，是对象或者方法
    if(x !== null && (typeof x === 'object' || typeof x === 'function')){
      //为了判断resolve过的就不用再reject了，（比如有reject和resolve的时候）
      let called
      try{//防止then出现异常，Object.defineProperty
        let then = x.then//取x的then方法可能会取到{then:{}},并没有执行
        if(typeof then === 'function'){
          //我们就认为他是promise,call他,因为then方法中的this来自自己的promise对象
          then.call(x,y=>{//第一个参数是将x这个promise方法作为this指向，后两个参数分别为成功失败回调
            if(called) return;
            called = true
            //因为可能promise中还有promise，所以需要递归
            resolvePromise(promise2,y,resolve,reject)
          },err=>{
            if(called) return;
            called = true
            //一次错误就直接返回
            reject(err)
          })
        }else{
          //如果是个普通对象就直接返回resolve作为结果
          resolve(x)
        }
      }catch(e){
        if(called) return;
        called = true
        reject(e)
      }
    }else{
      //这里返回的是非函数，非对象的值,就直接放在promise2的resolve中作为结果
      resolve(x)
    }
  }
  

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks= [];

    let resolve = (value) => {
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    } 

    let reject = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    }

    try {
      executor(resolve,reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    //解决 onFufilled，onRejected 没有传值的问题
    //Promise/A+ 2.2.1 / Promise/A+ 2.2.5 / Promise/A+ 2.2.7.3 / Promise/A+ 2.2.7.4
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后 then 的 resolve 中捕获
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    // 每次调用 then 都返回一个新的 promise  Promise/A+ 2.2.7
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //Promise/A+ 2.2.2
        //Promise/A+ 2.2.4 --- setTimeout
        setTimeout(() => {
          try {
            //Promise/A+ 2.2.7.1
            let x = onFulfilled(this.value);
            // x可能是一个proimise
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            //Promise/A+ 2.2.7.2
            reject(e)
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        //Promise/A+ 2.2.3
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(()=> {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        });
      }
    });
  
    return promise2;
  }
}


new Promise((resolve, reject) => {
    console.log('开始')
    setTimeout(() => {
        resolve('成功')
    }, 2000);
}).then(1,2).then(() => {
    return 'ke'
}, '').then(res => {
    console.log(res)
}).then(res => {})