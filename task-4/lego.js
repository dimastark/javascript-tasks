'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

/**
 * Приоритеты вызываемых функций.
 * Чем больше число, тем позднее она будет выполнена
 */
var QUERY_PRIORITIES = {
    'select': 3,
    'filterIn': 1,
    'format': 4,
    'limit': 4,
    'and': 1,
    'or': 1,
    'sortBy': 2
};

/**
 * @param {Array<Function>} query - запрос
 * @returns {Array<Function>} - сортировка функций запроса
 */
function organizeQuery(query) {
    return query.sort(function (a, b) {
        return QUERY_PRIORITIES[a.name] < QUERY_PRIORITIES[b.name] ? -1 : 1;
    });
}

/**
 * @param {Object} object - копируемый объект
 * @returns {Object} - копия
 */
function copyObject(object) {
    return Object.assign({}, object);
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var collectionClone = collection.map(copyObject);
    var queryFunctions = organizeQuery([].slice.call(arguments, 1));
    queryFunctions.forEach(function (queryFunction) {
        collectionClone = queryFunction(collectionClone);
    });

    return collectionClone;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function} - функция выбора
 */
exports.select = function () {
    var selectedFields = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (element) {
            return selectedFields.reduce(function (alreadySelected, field) {
                if (field in element) {
                    alreadySelected[field] = element[field];
                }

                return alreadySelected;
            }, {});
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function} - функция фильтрации
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (element) {
            return values.indexOf(element[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function} - функция сортировки
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.slice().sort(function (a, b) {
            if (order === 'asc') {
                return a[property] <= b[property] ? -1 : 1;
            }

            return a[property] <= b[property] ? 1 : -1;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function} - форматирющая функция
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (element) {
            element[property] = formatter(element[property]);

            return element;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function} - ограничивающая функция
 */
exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function} - функция, объединяющая фильтрующие функции
     */
    exports.or = function () {
        var filterFunctions = [].slice.call(arguments);

        return function or(collection) {
            return collection.filter(function (element) {
                return filterFunctions.some(function (filter) {
                    return filter(collection).indexOf(element) >= 0;
                });
            });
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function} - функция, пересекающая фильтрующие функции
     */
    exports.and = function () {
        var filterFunctions = [].slice.call(arguments);

        return function and(collection) {
            var collectionClone = collection.slice();
            filterFunctions.forEach(function (filter) {
                collectionClone = filter(collectionClone);
            });

            return collectionClone;
        };
    };
}
