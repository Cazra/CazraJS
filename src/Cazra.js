/**
 * Declaration of the Cazra namespace.
 * Requires Underscore JS
 */
Cazra = {
    version: '0.1.0'
};

/**
 * A handy, simnple function for debugging callbacks. It prints any arguments
 * given to it to the console.
 */
function printArgs() {
    console.log(arguments);
};

/**
 * Safely invokes a function. No effect if func is not a function or is undefined.
 * @param {function} func   The function to invoke.
 * @param {Object} scope    The context the function is invoked upon.
 * @param {any[]} args      The arguments.
 */
_.callback = _.callback || function(func, scope, args) {
    if(_.isFunction(func))
        func.apply(scope, args);
};

/**
 * Define console if it doesn't exist.
 */
try {
    console;
}
catch(err) {
    console = {
        asset: _.noop,
        count: _.noop,
        dir: _.noop,
        error: _.noop,
        group: _.noop,
        groupCollapsed: _.noop,
        groupEnd: _.noop,
        info: _.noop,
        log: _.noop,
        table: _.noop,
        time: _.noop,
        timeEnd: _.noop,
        trace: _.noop,
        warn: _.noop
    };
}
