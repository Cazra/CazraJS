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

    /**
     * Increments the lock.
     */
    wait: function() {
        if(this._isFired)
            throw new Cazra.Error('AsemError', 'Cannot wait asynchronous semaphore that has already been fired.');
        this._lock++;
    }

});
