

/**
 * gen UUID
 * @param len
 * @param radix 2 8 10 16
 * @returns string
 * var uuidstr = uuid(32,16);
 *  7FEA14A4722E273EE28C3F72E9E9141F
 */

function uuid (len = 32, radix = 16) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    let i
    radix = radix || chars.length

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    return uuid.join('')
}


/**
 * @param fn
 * @param wait
 */
function debounce (fn, wait = 300) {
    let timer = null
    return function () {
        const context = this
        const args = arguments
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, wait)
    }
}


/**
 * @param fn
 * @param gapTime
 */
function throttle (fn, gapTime = 300) {
    let _lastTime = null
    return function () {
        const _nowTime = +new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)
            _lastTime = _nowTime
        }
    }
}



export {
    uuid,
    debounce,
    throttle
}
