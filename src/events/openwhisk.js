const uuid4 = require('uuid4');
const shimmer = require('shimmer');
const {
    utils,
    tracer,
    eventInterface,
    event,
    errorCode,
} = require('epsagon');
const actions = require('openwhisk/lib/actions.js');


/**
 * Wraps the OpenWhisk module.
 * @param {Function} wrappedFunction The OpenWhisk module
 * @returns {Function} The wrapped function
 */
function openWhiskWrapper(wrappedFunction) {
    return function internalOWWrapper(options, callback) {
        const { name } = options;
        const fullName = `/${process.env['__OW_NAMESPACE']}/${name || options}`; // eslint-disable-line dot-notation
        const resource = new event.Resource([
            fullName,
            'openwhisk_action',
            'invoke',
        ]);
        const startTime = Date.now();
        const invokeEvent = new event.Event([
            `openwhisk-${uuid4()}`,
            utils.createTimestampFromTime(startTime),
            null,
            'openwhisk',
            0,
            errorCode.ErrorCode.OK,
        ]);

        invokeEvent.setResource(resource);

        const request = wrappedFunction.apply(this, [options, callback]);
        const responsePromise = new Promise((resolve) => {
            request.then((res) => {
                eventInterface.addToMetadata(
                    invokeEvent,
                    {
                        activation_id: res.activationId,
                        response: res.response,
                    }
                );
                invokeEvent.setDuration(utils.createDurationTimestamp(startTime));
                resolve();
            });
        });

        tracer.addEvent(invokeEvent, responsePromise);
        return request;
    };
}

module.exports = {
    /**
     * Initializes the OpenWhisk tracer
     */
    init() {
        if (actions) shimmer.wrap(actions.prototype, 'invoke', openWhiskWrapper);
    },
};
