function sleep(n) {
    let now = new Date()
    while(true) {
        if (+new Date () - now.getTime() > n) {
            break
        }
    }
}

setTimeout(() => {
    console.log(2)
}, 2000);
sleep(2000)