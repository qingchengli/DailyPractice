// 事件总线
class EventBus {
    constructor() {
        // 消息管理器(调度中心订阅者列表)
        this.events = {}
    }
    // 添加订阅者
    $on(eventName, callback) {
        // 判断是否已经有eventName,如果有,直接push
        if (eventName && this.events[eventName]) {
            this.events[eventName].push(callback)
        } else {
            this.events[eventName] = [callback]
        }
    }
    // 移除订阅者
    $off(eventName, fn) {
        if (arguments.length === 0) {
            this.events = {}
        }
        if (this.events[eventName]) {
            if (this.events[eventName].length === 1 || typeof fn !== 'function') {
                delete this.events[eventName]
            } else {
                this.events[eventName].splice(this.events[eventName].findIndex(e => e === fn), 1)
            }
        }
        // 如果只有事件,则移除这个事件所有的监听器
    }
    // 清除所有订阅者,集成到$off里
    // $clear() {
    //     this.events = {}
    // }
    // 只触发一次
    $once(eventName, callback) {
        let _this = this
        // 此处不考虑箭头函数绑定this,是因为箭头函数内部没有arguments这个参数对象
        function handler() {
            _this.$off(eventName)
            callback.apply(null,arguments)
        }
        this.$on(eventName,handler)
    }
    // 发布信息(通知订阅者)
    $emit(eventName, data) {
        if(eventName && this.events[eventName]) {
            for (let callback of this.events[eventName]) {
                callback && callback(data)
            }
        }
    }
}
function test1 (...params) {
    console.log(11, params)
  }

  function test2 (...params) {
    console.log(22, params)
  }

  function test3 (...params) {
    console.log(33, params)
  }

  function test4 (...params) {
    console.log(params)
    console.log(33, params)
  }
  //测试用例
  let eb = new EventBus()
  eb.$on('event1', test1)
  eb.$on('event1', test2)
  eb.$on('event1', test3)
  eb.$emit('event1', '第一次')

  eb.$off('event1', test1)
  eb.$emit('event1', ['第二次1', '第二次2'])

  eb.$once('once', test4);
  eb.$emit('once', '执行一次', 1, 2, 3)