function padding(n, unit) {
    let text = n + unit;
    if (text.length < 3) {
        return '0' + text;
    }
    return text;
}

/**
 * @param {Date} [t1, t2] two Date object
 * @return {String} elasped seconds from `t1` to `t2` with format `00d 00h 00m 00s`
 */
function formatElapsedTime(t1, t2) {
    let elapsed_sec = Math.round((t1 - t2) / 1000);
    if (elapsed_sec < 0) {
        elapsed_sec = -elapsed_sec;
    }
    let result = [];
    let time_units = [[86400, 'd'], [3600, 'h'], [60, 'm']];
    for (let i = 0; i < time_units.length; i++) {
        let param = time_units[i];
        if (elapsed_sec >= param[0]) {
            let value = Math.round(elapsed_sec / param[0])
            elapsed_sec = Math.round(elapsed_sec % param[0]);
            result.push(padding(value, param[1]));
        } else {
            result.push(padding(0, param[1]));
        }
    }
    result.push(padding(elapsed_sec, 's'));
    return result.join(' ');
}

module.exports.formatElapsedTime = formatElapsedTime;
