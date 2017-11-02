'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function bind(func, context) {
    return () => (func.apply(context, arguments));
}

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
            if (typeof this.events[event] === 'undefined') {
                this.events[event] = [];
            }
            this.events[event].push({
                context,
                handler: bind(handler, context)
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
            let selectedEvents = Object.keys(this.events)
                .filter((verifiableEvent) => (verifiableEvent
                    .indexOf(`${event}.`) === 0 || event === verifiableEvent));
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
            let selectedEvents = [];
            const deep = (event.indexOf('.') !== -1) ? (event.split('.').length) : 0;
            for (let i = 0; i < deep + 1; i++) {
                if (event in this.events) {
                    selectedEvents.push(event);
                }
                event = event.slice(0, event.lastIndexOf('.'));
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
                let currentTimes = 0;
                this.on(event, context, () => {
                    if (currentTimes < times) {
                        bind(handler, context)();
                    }
                    currentTimes++;
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
                let currentFrequency = 0;
                this.on(event, context, () => {
                    if (currentFrequency % frequency === 0) {
                        bind(handler, context)();
                    }
                    currentFrequency++;
                });
            }

            return this;
        }
    };
}
