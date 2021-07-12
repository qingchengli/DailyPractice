function sleep(n) {
    let now = new Date()
    while(true) {
        if (+new Date () - now.getTime() > n) {
            break
        }
    }
}