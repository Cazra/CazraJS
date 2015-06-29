/**
 * Declaration of the Cazra namespace.
 * Requires Underscore JS
 */
Cazra = {
    version: '1.0.0'
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
