/**
 * A small API around the Notification interface for automatically and
 * asynchronously handling permissions.
 * @requires Cazra, Cazra.Error
 */
Cazra.Notifications = (function() {
    var impl = {

        /**
         * Attempts to display a notification.
         * @param {String} title      The title text of the notification.
         * @param {Object} options    All options that can be passed into
         *      Notification's options parameter, plus the following additional
         *      options:
         *
         *    success: function(notification: Notification)
         *        The success callback, with the Notification that was created.
         *
         *    failure: function(error: Cazra.Error)
         *        The failure callback, with an error providing the reason for it.
         *
         *    scope: Object
         *        The scope of the callbacks.
         */
        show: function(title, options) {
            options = options || {};
            if(Notification.permission == 'granted')
                this._show(title, options);
            else if(Notification.permission != 'denied')
                Notification.requestPermission(function(result) {
                    if(result == 'denied')
                        _.callback(options.failure, options.scope, [new Cazra.Error('PermissionError', 'Permission Denied.')]);
                    else
                        this._show(title, options);
                }.bind(this));
            else
                _.callback(options.failure, options.scope, [new Cazra.Error('PermissionError', 'Permission Denied.')]);
        },

        /**
         * @private
         * Helper method for show().
         */
        _show: function(title, options) {
            var noti = new Notification(title, {
                dir: options.dir,
                lang: options.lang,
                body: options.body,
                tag: options.tag,
                icon: options.icon,
                data: options.data,
                sound: options.sound,
                vibrate: options.vibrate,
                renotify: options.renotify,
                silent: options.silent,
                noscreen: options.noscreen,
                sticky: options.sticky
            });

            _.callback(options.success, options.scope, [noti]);
        }
    };

    return {
        show: function(title, options) {
            return impl.show(title, options);
        }
    };
})();
