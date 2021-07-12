function _instanceof(left, right) {
    if (typeof left !== 'object' || left === null) {
        return false
    }
    let phototype = Object.getPrototypeOf(left)
    while(true) {
        if (phototype === null) {
            return false
        }
        if (phototype === right.prototype) {
            return true
        }
        phototype = Object.getPrototypeOf(phototype)
    }
}