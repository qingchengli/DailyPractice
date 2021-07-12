// 未考虑循环引用(考虑Date和RegExp正则)
function cloneDeep(obj) {
    // 排除非引用类型和null
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    // 判断Date和正则
    let Constructor = obj.constructor
    if (Constructor === Date) {
        // 关于getTime的意义,不是很明白,因为不用这个,直接new也有同样的效果
        return new Constructor(obj.getTime())
    }
    if (Constructor === RegExp) {
        return new Constructor(obj)
    }
    let newObj = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
        // 如果只需要复制自有属性,则需要用hasOwnProperty来判断
        // if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
            newObj[key] = cloneDeep(obj[key])
        } else {
            newObj[key] = obj[key]
        }
        // }
    }
    return newObj
}

let a = new Date()
let b = new Date()
let obj = {
    a,
    b,
    c: {
        name: 2,
        a,
        b
    }
}
let obj2 = cloneDeep(obj)
obj2.c.b = 3
console.log(obj, obj2)