/**
 * Created by yan on 9/3/14.
 */
module.exports = function(min, max) {
    if (max < min) {
        var tmp = max;
        max = min;
        min = max;
    }
    var dt = max - min;

    return function(u, next, skip) {
        setTimeout(next, Math.floor(Math.random() * dt + min));
    };
};