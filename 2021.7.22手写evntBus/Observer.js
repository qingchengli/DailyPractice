// 观察者模式
// 定义目标函数
class Subject {
    constructor() {
        // 创建观察者列表
        this.observers = []
    }
    // 定义添加函数
    add(observer) {
        this.observers.indexOf(observer) === -1 && this.observers.push(observer)
    }
    // 定义删除函数
    remover(observer) {
        let idx = this.observers.indexOf(observer)
        idx !== -1 && this.observers.splice(idx, 1)
    }
    // 定义发布时间
    publish(data) {
        for (let observer of this.observers) {
            observer.update(data)
        }
    }
}

// 定义观察者
class Observer {
    constructor(name) {
        this.name = name
    }
    update(data) {
        console.log(`我叫${this.name}, 我的成绩是${data.grade}`)
    }
}

let obj1 = new Observer('小明')
let obj2 = new Observer('小红')
let subject = new Subject()
subject.add(obj1)
subject.add(obj2)
subject.publish({
    grade: 22
})