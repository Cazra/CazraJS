/**
 * A dictionary of words and their definitions.
 * @param {String} srcUrl
 *        The URL to load the dictionary data from. This text file is just
 *        a stringified JSON object of word:definition pairs.
 */
Cazra.Dictionary = function(srcUrl) {
    this._srcUrl;
    this._isLoaded = false;
    this._dictionary = {};
};

_.extend(Cazra.Dictionary.prototype, {
    /**
     * Gets the definition of a word.
     * This method is asynchronous iff options is provided.
     * @param {String} word   The word we want the definition of.
     * @param {Object} [options]
     *        success: function(definition: String)
     *        failure: function(error: Cazra.Error)
     *        scope: Object
     * @return {String} The definition.
     */
    getDefinition: function(word, options) {
        if(options) {
            this.load({
                success: function() {
                    var definition = this.getDefinition(word);
                    _.callback(options.success, options.scope, [defintion]);
                },
                failure: function(err) {
                    _.callback(options.failure, options.scope, [err]);
                },
                scope: this
            });
        }
        else
            return this._dictionary[word.toLowerCase()];
    },


    /**
     * Gets the number of words in the dictionary.
     * This method is asynchronous iff options is provided.
     * @param  {Object} [options]
     *         success: function(size: int)
     *         failure: function(error: Cazra.Error)
     * @return {int}
     */
    getSize: function(options) {
        if(options) {
            this.load({
                success: function() {
                    var size = this.getSize();
                    _.callback(options.success, options.scope, [size]);
                },
                failure: function(error) {
                    _.callback(options.failure, options.scope, [error]);
                },
                scope: this
            });
        }
        else
            return this.getWords().length;
    },


    /**
     * Gets a list of words from this dictionary passing some filter function.
     * This method is asynchronous iff options is provided.
     * @param  {function(word: String, definition: String) : Boolean} [filter]
     *         Returns true for the word iff it should be kept in the result list.
     *         If not provided, all words will be returned.
     *
     * @param  {Object} [options]
     *         success: function(words: String[])
     *         failure: function(error: Cazra.Error)
     * @return {String[]}
     */
    getWords: function(filter, options) {
        if(!filter)
            filter = function() {
                return true;
            };

        if(options) {
            this.load({
                success: function() {
                    var result = this.getWords(filter);
                    _.callback(options.success, options.scope, [result]);
                },
                failure: function(error) {
                    _.callback(options.failure, options.scope, [error]);
                },
                scope: this
            });
        }
        else {
            var result = [];

            _.each(this._dictionary, function(definition, word) {
                if(filter(word, definition)
                    result.push(word);
            }, this);

            return result;
        }

    },


    /**
     * Checks whether some word is in the dictionary.
     * This method is asynchronous iff options is provided.
     * @param  {String} word    The word to check.
     * @param  {Object} [options]
     *         success: function(result: Boolean}
     *         failure: function(error: Cazra.Error)
     *         scope: Object
     * @return {Boolean} True iff word exists in the dictionary.
     */
    isWord: function(word, options) {
        if(options) {
            this.load({
                success: function() {
                    var result = this.isWord(word);
                    _.callback(options.success, otions.scope, [result]);
                },
                failure: function(err) {
                    _.callback(options.failure, options.scope, [err]);
                },
                scope: this
            });
        }
        else
            return !!this._dictionary[word.toLowerCase()];
    },


    /**
     * Loads the dictionary from its external resource if it hasn't already
     * been loaded.
     * @param {Object} options
     *    success: function()
     *    failure: function(Cazra.Error)
     *    scope: Object
     */
    load: function(options) {
        options = options || {};

        if(this._isLoaded)
            _.callback(options.success, options.scope, []);
        else {
            Cazra.Ajax.request({
                url: this._srcUrl,
                method: 'GET',
                success: function(xhr) {
                    try {
                        var srcDict = JSON.parse(xhr.responseText);
                        this._dictionary = {};

                        _.each(srcDict, function(definition, word) {
                            this._dictionary[word.toLowerCase()] = definition;
                        }, this);

                        this._isLoaded = true;
                        _.callback(options.success, options.scope, []);
                    }
                    catch(err) {
                        _.callback(options.failure, options.scope, [new Cazra.Error('JSONError', 'Could not parse HTTP response.')]);
                    }
                },
                failure: function(err) {
                    _.callback(options.failure, options.scope, [err]);
                },
                scope: this
            });
        }
    }
});
