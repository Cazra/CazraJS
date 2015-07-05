/**
 * A conucurrency construct implementing an asynchronous semaphore.
 * This allows a function to be invoked only after a group of other
 * potentially asynchronous functions have resolved.
 * See: https://en.wikipedia.org/wiki/Asynchronous_semaphore
 * @param  {int}   initLock     The initial value of the Asem's lock.
 * @param  {Function} callback  The function invoked when signal causes the lock to become 0.
 * @param  {[type]}   scope     The scope of the callback.
 */
Cazra.Asem = function(initLock, callback, scope) {
    if(!initLock)
        initLock = 0;

    this._lock = initLock;
    this._callback = callback;
    this._scope = scope;
    this._isFired = false;

    if(Cazra.Asem.debug) {
        Cazra.Asem.assignId(this);

        console.info('Created Asem: ', this);
        Cazra.Asem.debug._activeAsems.push(this);
    }
};

_.extend(Cazra.Asem.prototype, {

    /**
     * Returns the current lock count of the Asem.
     * @return {int}
     */
    getLockCount: function() {
        return this._lock;
    },

    /**
     * Decrements the lock. If the lock becomes zero, the callback is invoked.
     */
    signal: function() {
        this._lock--;
        if(this._lock == 0) {
            if(this._isFired)
                throw new Cazra.Error('Asem');
            else {
                this._isFired = true;
                _.callback(this._callback, this._scope, []);
            }
        }
        else if(this._lock < 0) {
            throw new Cazra.Error('AsemError', 'Cannot signal asynchronous semaphore with a lock value that is already 0.');
        }
    },

    /**
     * Returns a function which invokes this Asem's signal.
     * @return {function()}
     */
    toFn: function() {
        var me = this;
        return function() {
            me.signal();
        };
    },

    toString: function() {

    },

    /**
     * Increments the lock.
     */
    wait: function() {
        if(this._isFired)
            throw new Cazra.Error('AsemError', 'Cannot wait asynchronous semaphore that has already been fired.');
        this._lock++;
    }
});

/**
 * Static properties.
 */
_.extend(Cazra.Asem, {
    /**
     * Set this to true to enable debugging of Asems.
     * With debugging turned on, you can keep track of Asems that haven't been
     * fired yet.
     * Also, with debug on, messages will be printed to the console when Asems
     * are created, waited, signaled, and fired.
     * @type {Boolean}
     */
    debug: false,

    _nextId: 0,
    _activeAsems: [],



    /**
     * @private
     * @param  {Cazra.Asem} asem
     */
    _debugCreate: function(asem) {
        if(this.debug) {
            asem._id = this._nextId;
            this._nextId++;

            this._activeAsems.push(asem);

            console.info('Created Asem: ', asem);
        }
    },

    /**
     * @private
     * @param  {Cazra.Asem} asem
     */
    _debugFire: function(asem) {
        if(this.debug) {
            var index = this._activeAsems.indexOf(asem);
            this._activeAsems.splice(index, 1);

            console.info('Fired Asem: ', asem);
        }
    },

    /**
     * @private
     * @param  {Cazra.Asem} asem
     */
    _debugSignal: function(asem) {
        if(this._debug) {
            console.info('Signaled Asem: ', asem, asem._lock);
        }
    },

    /**
     * @private
     * @param  {Cazra.Asem} asem
     */
    _debugWait: function(asem) {
        if(this._debug)
            console.info('Waited Asem: ', asem, asem._lock);
    },


    /**
     * Returns the list of Asems that haven't been fired yet.
     * @return {[type]} [description]
     */
    getUnfiredAsems: function() {
        return _.clone(this._activeAsems);
    }
});
