// 假设问题: 多重数组去重
// 尽量不操作原数组
// 方法一: 使用双重循环结合splice
function unique1(arr1) {
    // 拷贝一份
    let arr = JSON.parse(JSON.stringify(arr1))
    let len = arr.length
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[j] === arr[i]) {
                arr.splice(j, 1)
                j--
            }
        }
    }
    return arr
}

// 方法二: 利用数组的indexOf方法,创建新数组,如果indexOf === -1,就往里放
function unique2(arr2) {
    let arr = []
    let len = arr2.length
    for (let i = 0; i < len; i++) {
        if (arr.indexOf(arr2[i]) === -1) {
            arr.push(arr2[i])
        }
    }
    return arr
}

// 方法三: 利用数组sort排序,然后对比相邻位置的是否重复(相邻对比法)
function unique3(arr3) {
    let arr = []
    let middle = JSON.parse(JSON.stringify(arr3))
    middle = middle.sort()
    let len = middle.length
    arr[0] = middle[0]
    debugger
    for (let i = 1; i < len; i++) {
        if (middle[i] !== middle[i - 1]) {
            arr.push(middle[i])
        }
    }
    return arr
}

// 方法四: 利用es6的set数据结构和Array.from api或者扩展操作符配合去重
function unique4(arr4) {
    // a
    // return [...new Set(arr)]
    // b
    return Array.from(new Set(arr4))
}

// 补充: set亦可以作为字符串去重的手段
// [...new Set('ababbc')].join('') 向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。

// 方法五: 利用数组.reduce循环方法
// array.reduce(function(accumulator, currentValue, currentIndex, array), initialValue)
// initialValue：初始值（可选）
// accumulator： reduce 方法多次执行的累积结果。若有提供initialValue，则第一次循环时 accumulator 的值便为 initialValue；若未提供initialValue，第一次循环时 accumulator 的值为数组第一项arr[0]。（必需）
// currentValue：数组循环当前处理的值。若有提供 initialValue，第一次循环currentValue 的值为数组第一项arr[0]；若未提供initialValue，第一次循环由于arr[0]成了accumulator 的值，所以currentValue 只能从arr[1]开始。（必需）
// currentIndex：数组循环当前处理值的索引。
// array：当前正在被循环的数组。
function unique5(arr5) {
    let arr = arr5.reduce(function(prev, cur) {
        prev.indexOf(cur) === -1 && prev.push(cur)
        return prev
    },[])
    return arr
}

// 利用filter结合indexOf 查找索引来去重
// 思路就是利用filter判断第一次出现的下标
function unique6(arr6) {
    let arr = arr6.filter((ele,index) => (
        arr6.indexOf(ele) === index
    ))
    return arr
}

// 利用es6 map去重
function unique7(arr7) {
    let arr = []
    let map = new Map()
    for (let i in arr7) {
        if (map.has(arr7[i])) {
            map.set(arr7[i], true)
        } else {
            map.set(arr7[i], false)
            arr.push(arr7[i])
        }
    }
    return arr
}

// 函数递归去重
// 利用sort先排序,然后用递归不断对比相邻元素大小
function unique8(arr8) {
    // 先排序
    let len = arr8.length
    let arr1 = arr8
    arr1.sort((a, b) => (a-b))
    function loop(index) {
        if (index >= 1) {
            if (arr1[index] === arr1[index - 1]) {
                arr1.splice(index, 1)
            }
            loop(index - 1)
        }
    }
    // 从最后一个开始对比
    loop(len - 1)
    return arr1
}

let arr = [1,3,4,3,3,5,1,4,6,8,9,98,32,4,null,undefined,null,32]
console.log(unique8(arr))