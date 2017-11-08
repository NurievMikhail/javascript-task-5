'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (this.events[event] === undefined) {
                this.events[event] = [];
            }
            this.events[event].push({
                context,
                handler: handler.bind(context)
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            const selectedEvents = Object.keys(this.events)
                .filter((eventName) => ((`${eventName}.`).startsWith(`${event}.`)));
            selectedEvents.forEach((selectedEvent) => {
                this.events[selectedEvent] = this.events[selectedEvent].filter(
                    (student) => (student.context !== context));
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const selectedEvents = [];
            const deep = (event.indexOf('.') !== -1) ? (event.split('.').length) : 0;
            let transmittedEvent = event;
            for (let i = 0; i < deep + 1; i++) {
                if (transmittedEvent in this.events) {
                    selectedEvents.push(transmittedEvent);
                }
                transmittedEvent = transmittedEvent.slice(0, transmittedEvent.lastIndexOf('.'));
            }
            selectedEvents.forEach((selectedEvent) => {
                this.events[selectedEvent].forEach(student => {
                    student.handler();
                });
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                this.on(event, context, handler);
            } else {
                let callCount = 0;
                this.on(event, context, () => {
                    if (callCount < times) {
                        handler.bind(context)();
                    }
                    callCount++;
                });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler);
            } else {
                let callCount = 0;
                this.on(event, context, () => {
                    if (callCount % frequency === 0) {
                        handler.bind(context)();
                    }
                    callCount++;
                });
            }

            return this;
        }
    };
}
