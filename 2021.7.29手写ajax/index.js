let Options = {
    url: string,
    method: string,
    data: any,
    timeout: number,
    headers: object,
    async: boolean,
}


// responseText：请求返回的数据内容
// responseXML：如果响应内容是  "text/xml""application/xml"，这个属性将保存响应数据的 XML DOM文档

// status：响应的HTTP状态，如 200 304 404 等
// statusText：HTTP状态说明
// readyStatus：请求/响应过程的当前活动阶段
// timeout：设置请求超时时间
// 格式化get请求参数
function toQueryString(params) {
    let dataArr = [];
    params.t = Math.random();
    for (let key in params) {
        dataArr.push(`${key}=${encodeURIComponent(params[key])}`);
    }
    return dataArr.join('&');
}

// 思路: 利用promise来实现ajax
function ajax(options = { method: 'GET', data: {}, url: '', timeout: 10000, async: true }) {
    return new Promise((resolve, reject) => {
        if (!options.url) {
            throw new Error('The url is required!')
        }
        let xhr
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else {
            // 兼容ie
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        // 处理get参数
        const queryString = toQueryString(options.data)
        // 设置请求头
        const header = options.headers || { 'Content-Type': 'application/json;charset=UTF-8' }
        Object.keys(header).forEach(key => {
            xhr.setRequestHeader(key, header[key])
        })
        // 超时处理
        xhr.timeout = options.timeout
        xhr.ontimeout = () => {
            reject('请求超时')
        }
        // 判断请求类型
        let method = options.method.toUpperCase()
        if (method === 'GET') {
            xhr.open('GET', `${options.url}?${queryString}`, options.async)
            xhr.send()
        } else if (method === 'POST') {
            // post请求放在请求体里
            xhr.open('POST', options.url, options.async)
            xhr.send(options.data)
        }
        // 处理接收数据
        // xhr.readyState==0 尚未调用 open 方法
        // xhr.readyState==1 已调用 open 但还未发送请求（未调用 send）
        // xhr.readyState==2 已发送请求（已调用 send）
        // xhr.readyState==3 已接收到请求返回的数据
        // xhr.readyState==4 请求已完成

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304) {
                    resolve(xhr.responseText)
                } else {
                    reject(res.status)
                }
            }
        }
    })
}