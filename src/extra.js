function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
            callback();
            return;
        }
        else {
            setTimeout(function () {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}

docReady(() => {
    waitForElementToDisplay(".suite-summary--component---cFAkx", function () {
        var list = document.querySelector('.suite-summary--component---cFAkx')
        var a = `<a href="assets/template.opt" class="suite-summary--summary-item---JHYFN" title="Template">Download Template</a>`
        var div = document.createElement('div')
        div.innerHTML = a
        list.appendChild(div.firstChild)
    }, 1000, 9000);
})