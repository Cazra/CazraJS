/**
 * A small API for geolocation of the user's device.
 * Once the Geolocation permissions are ready, this singleton's
 * operations can be used either synchronously or asynchronously.
 */
Cazra.Geolocation = (function() {
    var impl = {

        _lastPosition: {},
        _lastTimestamp: undefined,
        _isWatched: false,

        /**
         * Retrieves the accuracy of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(accuracy: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getAccuracy: function(options) {
            return this._getCoordsProperty('accuracy', options);
        },

        /**
         * Retrieves the altitude of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(altitude: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getAltitude: function(options) {
            return this._getCoordsProperty('altitude', options);
        },

        /**
         * Retrieves the accuracy of the user's current altitude.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(altitudeAccuracy: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getAltitudeAccuracy: function(options) {
            return this._getCoordsProperty('altitudeAccuracy', options);
        },

        /**
         * Retrieves some property of the user's current coordinates.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(property: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        _getCoordsProperty: function(propName, options) {
            if(_.isObject(options))
                this.getPosition({
                    success: function(position) {
                        _.callback(options.success, options.scope, [position.coords[propName]]);
                    },
                    failure: function(error) {
                        _.callback(options.failure, options.scope, [error]);
                    }
                });
            else
                return this.getPosition().coords[propName];
        },

        /**
         * Retrieves the heading of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(heading: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getHeading: function(options) {
            return this._getCoordsProperty('heading', options);
        },

        /**
         * Returns the last timestamp for when the position data was updated.
         * @return {number} The timestamp
         */
        getLastTimestamp: function() {
            return this._lastTimestamp;
        },

        /**
         * Retrieves the latitude of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(latitude: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getLatitude: function(options) {
            return this._getCoordsProperty('latitude', options);
        },

        /**
         * Retrieves the longitude of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(longitude: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getLongitude: function(options) {
            return this._getCoordsProperty('longitude', options);
        },

        /**
         * Retrieves the speed of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(speed: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getSpeed: function(options) {
            return this._getCoordsProperty('speed', options);
        },

        /**
         * Retrieves the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(position: Position)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getPosition: function(options) {
            if(!_.isObject(options)) {
                if(this._isWatched)
                    return this._lastPosition;
                else
                    throw new Cazra.Error('PositionUnavailableError', 'Could not get updated position data.');
            }
            else if(this._isWatched)
                _.callback(options.success, options.scope, [this._lastPosition]);
            else if(!this._watchId) {
                this._watchId = navigator.geolocation.watchPosition(
                    function(position) { // Success callback.
                        this._lastPosition = position;
                        this._lastTimestamp = position.timestamp;

                        if(!this._isWatched) {
                            this._isWatched = true;
                            _.callback(options.success, options.scope, [position]);
                        }
                    }.bind(this),
                    function(positionError) { // Error callback.
                        var code = positionError.code;
                        var type;

                        if(code == 1)
                            type = 'PermissionError';
                        else if(code == 2)
                            type = 'PositionUnavailableError';
                        else if(code == 3)
                            type = 'TimeoutError';
                        else
                            type = 'UnknownError';

                        this._watchId = undefined;

                        var error = new Cazra.Error(type, positionError.message);
                        _.callback(options.failure, options.scope, [error]);

                    },
                    options.positionOptions
                );
            }
            else
                _.callback(options.failure, options.scope, [new Cazra.Error('NotReadyError', 'Geolocation is not ready.')]);
        },


        start: function(options) {
            // TODO
        },

        stop: function() {

        }
    };

    return {
      /**
       * Retrieves the accuracy of the user's current position.
       * The operation will be asynchronous iff the options parameter is provided.
       * @param  {Object} [options]
       *         success: function(accuracy: number)
       *         failure: function(error: Cazra.Error)
       *         scope: Object
       * @return {Position}
       */
        getAccuracy: function(options) {
            return impl.getAccuracy(options);
        },

        /**
         * Retrieves the altitude of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(altitude: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getAltitude: function(options) {
            return impl.getAltitude(options);
        },

        /**
         * Retrieves the accuracy of the user's current altitude.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(altitudeAccuracy: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getAltitudeAccuracy: function(options) {
            return impl.getAltitudeAccuracy(options);
        },

        /**
         * Retrieves the heading of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(heading: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getHeading: function(options) {
            return impl.getHeading(options);
        },

        /**
         * Returns the last timestamp for when the position data was updated.
         * @return {number} The timestamp
         */
        getLastTimestamp: function() {
            return impl.getLastTimestamp();
        },

        /**
         * Retrieves the latitude of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(latitude: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getLatitude: function(options) {
            return impl.getLatitude(options);
        },

        /**
         * Retrieves the longitude of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(longitude: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getLongitude: function(options) {
            return impl.getLongitude(options);
        },

        /**
         * Retrieves the speed of the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(speed: number)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getSpeed: function(options) {
            return impl.getSpeed(options);
        },

        /**
         * Retrieves the user's current position.
         * The operation will be asynchronous iff the options parameter is provided.
         * @param  {Object} [options]
         *         success: function(position: Position)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {Position}
         */
        getPosition: function(options) {
            return impl.getPosition(options);
        }
    };
})();
