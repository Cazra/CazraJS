/**
 * Encapsulates an error with type and source info.
 * @param {String} type   The type of error. Useful for type-checking errors.
 * @param {String} message  A message with a brief explanation about the error.
 * @param {Object} [source]   The object from which this error originates.
 */
Cazra.Error = function(type, message, source) {
    this.type = type;
    this.message = message;
    this.source = source;

    try {
        throw new Error();
    }
    catch(err) {
        this.stackTrace = err.stack;
    }
};

Cazra.Error.prototype = {
    isError: true,

    /**
     * Returns the error's message.
     * @return {String}
     */
    getMessage: function() {
        return this.message;
    },

    getSource: function() {
        return this.source;
    },

    getStackTrace: function() {
        return this.stackTrace;
    },

    getType: function() {
        return this.type;
    }
};
