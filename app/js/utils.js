// Debounce receives an input function, and waits to evaluate it until there is a sufficient delay inbetween triggering

function debounce(func, delay=1000) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            timeoutId = null;
            func.apply(null, args);
        }, delay);
    };
};