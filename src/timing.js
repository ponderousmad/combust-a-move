var TIMING = (function () {
    "use strict";
    
    var getTimestamp = null,
        lastTime = 0;
        
    if (window.performance.now) {
        console.log("Using high performance timer");
        getTimestamp = function () { return window.performance.now(); };
    } else {
        if (window.performance.webkitNow) {
            console.log("Using webkit high performance timer");
            getTimestamp = function () { return window.performance.webkitNow(); };
        } else {
            console.log("Using low performance timer");
            getTimestamp = function () { return new Date().getTime(); };
        }
    }
    lastTime = getTimestamp();
    
    function getLastTime() {
        return lastTime;
    }
    
    function updateDelta() {
        var now = getTimestamp(),
            elapsed = now - lastTime;
        lastTime = now;
        return elapsed;
    }
    
    function getTimeSince(time) {
        return time - getTimestamp();
    }
    
    return {
        frameStart: getLastTime,
        now: getTimestamp,
        since: getTimeSince,
        updateDelta: updateDelta
    };
}());
