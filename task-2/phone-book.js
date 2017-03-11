'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Формат телефона
 */
var phoneRe = /^(\d)\1{2}(\d)\2{2}(\d)\3(\d)\4$/;

/**
 * @param {String} str
 * @returns {boolean} - str - не пустая строка
 */
function isNotEmptyString(str) {
    return typeof str === 'string' && str !== '';
}

/**
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {null | Object} - возвращает контакт, если успешно
 */
function toRecord(phone, name, email) {
    var phoneValid = phoneRe.test(phone) && isNotEmptyString(phone);
    var nameValid = isNotEmptyString(name);
    var emailValid = email === undefined || isNotEmptyString(email);
    if (phoneValid && nameValid && emailValid) {
        return { phone: phone, name: name, email: email };
    }

    return null;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} успешно или нет
 */
exports.add = function (phone, name, email) {
    var record = toRecord(phone, name, email);
    if (record !== null) {
        var contains = phoneBook.some(function (element) {
            return element.phone === phone;
        });
        if (!contains) {
            phoneBook.push(record);

            return true;
        }
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} успешно или нет
 */
exports.update = function (phone, name, email) {
    var updated = false;
    var record = toRecord(phone, name, email);
    if (record !== null) {
        phoneBook.forEach(function (element) {
            if (element.phone === phone) {
                element.name = name;
                element.email = email;
                updated = true;
            }
        });
    }

    return updated;
};

/**
 * @param {String} phone - номер телефона в формате \d{10}
 * @returns {String} перевод номера в "хороший" формат
 */
function formatPhoneNumber(phone) {
    var slice1 = phone.slice(0, 3);
    var slice2 = phone.slice(3, 6);
    var slice3 = phone.slice(6, 8);
    var slice4 = phone.slice(8, 10);

    return '+7 (' + slice1 + ') ' + slice2 + '-' + slice3 + '-' + slice4;
}

/**
 * @param {Object} obj
 * @param {String} substring - непустая подстрока
 * @returns {int} - индекс в строке или -1
 */
function indexOf(obj, substring) {
    if (typeof obj === 'string' && substring.length !== 0) {
        return obj.indexOf(substring);
    }

    return -1;
}

/**
 * @param {String} query - запрос
 * @returns {Array} все подходящие записи
 */
function filterBy(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    } else if (query === '*') {
        return phoneBook;
    } else if (query.length !== 0) {
        return phoneBook.filter(function (element) {
            var inMail = indexOf(element.email, query) !== -1;
            var inName = indexOf(element.name, query) !== -1;
            var inPhone = indexOf(element.phone, query) !== -1;

            return inMail || inName || inPhone;
        });
    }
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {int} количество удаленных записей
 */
exports.findAndRemove = function (query) {
    var select = filterBy(query);
    var len = select.length;
    phoneBook = phoneBook.filter(function (element) {
        return select.indexOf(element) === -1;
    });

    return len;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array<String>} Все подходящие объекты в виде строк
 */
exports.find = function (query) {
    return filterBy(query).map(function (obj) {
        var output = obj.name + ', ' + formatPhoneNumber(obj.phone);
        if (obj.email !== undefined) {
            output += ', ' + obj.email;
        }

        return output;
    })
        .sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    if (isNotEmptyString(csv)) {
        var added = csv.split('\n').filter(function (part) {
            var data = part.split(';');
            if (data.length > 3) {
                return false;
            }

            return (exports.add(data[1], data[0], data[2]) ||
                exports.update(data[1], data[0], data[2]));
        });

        return added.length;
    }

    return 0;
};
