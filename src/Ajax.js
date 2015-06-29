Cazra.Ajax = (function() {

    var impl = {

        _initRequestListeners: function(xhr, options) {
            xhr.addEventListener('progress', function(evt) {
                console.log('AjaxProgressEvent:', evt, xhr);

                var progress;
                if(evt.lengthComputable)
                    progress = { // TODO: Create a 'Progress' object to pass to the callback.
                        alpha: evt.loaded/evt.total,
                        loaded: evt.loaded,
                        total: evt.total
                    };

                _.callback(options.progress, options.scope, [progress, evt]);
            });


            xhr.addEventListener('error', function(evt) {
                console.error('AjaxErrorEvent:', evt);

                var status = xhr.status;
                var message = xhr.statusText;

                _.callback(options.failure, options.scope, [new Cazra.Error('AjaxError', status + ' ' + message)]);
            });


            xhr.addEventListener('abort', function(evt) {
                console.warn('AjaxAbortEvent:', evt);
                _.callback(options.failure, options.scope, [new Cazra.Error('AjaxAbortError', 'The AJAX request was aborted.')]);
            });


            xhr.addEventListener('timeout', function(evt) {
                console.error('AjaxTimeoutEvent:', evt, xhr);
                _.callback(options.failure, options.scope, [new Cazra.Error('AjaxTimeoutError', 'The AJAX request timed out.')]);
            });


            xhr.addEventListener('load', function(evt) {
                console.log('AjaxLoadEvent:', evt);

                if(xhr.status >= 200 && xhr.status < 300)
                    _.callback();
            });
        },

        /**
         * Makes an HTTP request using AJAX.
         * @param  {Object} options
         *         success: function(xhr: XMLHttpRequest)
         *         failure: function(error: Cazra.Error)
         *         scope: Object
         * @return {XmlHttpRequest} The HTTP request object used to make the
         *                              AJAX call.
         */
        request: function(options) {
            var xhr = new XMLHttpRequest();

            this._initRequestListeners(xhr, options);

            xhr.open(options.method, options.url, true, options.user, options.password);

            // Set up the request headers.
            _.each(options.headers, function(value, header) {
                xhr.setRequestHeader(header, value);
            });
            xhr.withCredentials = options.withCredentials;
            xhr.timeout = options.timeout;

            // Send the AJAX request.
            xhr.send(options.content);
            return xhr;
        }
    };

    return {

      /**
       * Makes an HTTP request using AJAX.
       * @param  {Object} options
       *         success: function(xhr: XMLHttpRequest)
       *         failure: function(error: Cazra.Error)
       *         scope: Object
       * @return {XmlHttpRequest} The HTTP request object used to make the
       *                              AJAX call.
       */
        request: function(options) {
            return impl.request(options);
        }
    };

})();
