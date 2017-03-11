'use strict';

/**
 * Сделано задание на звездочку
 * Реализовано оба метода и tryLater
 */
exports.isStar = true;

/**
 * Нужный формат времени для расписания
 * Можно не мудрствовать, т.к. корректность гарантирована
 * @type {RegExp}
 */
var ROBBERY_TIME_RE = /(ПН|ВТ|СР|ЧТ|ПТ|СБ|ВС) (\d+:\d+)\+(\d+)/;
var IND_BY_DAY = { ПН: 1, ВТ: 2, СР: 3 };
var DAY_BY_IND = { 1: 'ПН', 2: 'ВТ', 3: 'СР' };
var MS_IN_HOUR = 60 * 60 * 1000;

/**
 * Функция для перевода записи из расписания банды в строку вида:
 * '1 {номер дня недели} 2007 {часы}:{минуты} GMT+{часовой пояс}'
 * @param {String} scheduleString - строка в грабительском формате
 * @returns {String} - "{day} {month} {year} {hours}:{minutes} GMT+{timezone}"
 */
function toGMTTimeString(scheduleString) {
    var match = ROBBERY_TIME_RE.exec(scheduleString);
    // Хочу использовать `интерполяцию`  :(

    return '1 ' + IND_BY_DAY[match[1]] + ' 2007 ' + match[2] + ' GMT+' + match[3];
}

/**
 * Функция для форматирования {date} по шаблону {template} с учетом часового пояса
 * @param {String} template - строка, которая может содержать %HH, %MM, %DD
 * @param {Object} date - форматируемая дата
 * @param {Number} timezone - зона в которой время будет отформатировано
 * @returns {String} - отформатированная строка с замененными %HH, %MM, %DD
 */
function formatDateInTimezone(template, date, timezone) {
    var shiftedDate = new Date(date.from + MS_IN_HOUR * timezone);
    var dd = DAY_BY_IND[shiftedDate.getUTCDay()];
    var hh = padTime(shiftedDate.getUTCHours());
    var mm = padTime(shiftedDate.getUTCMinutes());

    return template.replace('%DD', dd)
        .replace('%HH', hh)
        .replace('%MM', mm);
}

/**
 * Переводим запись из расписания в интервал (два числа from и to)
 * @param {Object} schedule - from и to в виде строк
 * @returns {Object} - from и to в виде количества секунд
 */
function toTimeInterval(schedule) {
    return {
        from: Date.parse(toGMTTimeString(schedule.from)),
        to: Date.parse(toGMTTimeString(schedule.to))
    };
}

/**
 * Компаратор сравнивающий начала интервалов
 * @param {Object} first - интервал
 * @param {Object} second - интервал
 * @returns {number}
 */
function compareIntervals(first, second) {
    return first.from - second.from;
}

/**
 * Объединить все интервалы {intervals} и получить взаимно не пересекающиеся отрезки
 * @param {Array} intervals - Временные отрезки (Object с from и to)
 * @returns {Array} - взаимно не пересекающиеся временные отрезки
 */
function joinIntervals(intervals) {
    var sortedIntervals = intervals.sort(compareIntervals);
    var uniqueIntervals = [sortedIntervals[0]];
    for (var i = 1; i < sortedIntervals.length; i++) {
        var last = uniqueIntervals[uniqueIntervals.length - 1];
        if (sortedIntervals[i].from <= last.to) {
            last.to = Math.max(sortedIntervals[i].to, last.to);
        } else {
            uniqueIntervals.push(sortedIntervals[i]);
        }
    }

    return uniqueIntervals;
}

/**
 * Ищем свободное время (время вне {intervals} с длинной {len})
 * @param {Array} intervals - все временные интервалы (непересекающиеся)
 * @param {Number} len - длина необходимого интервала
 * @returns {Array} - все свободные места
 */
function getGaps(intervals, len) {
    var gapIntervals = [];
    var sortedIntervals = intervals.sort(compareIntervals);
    for (var i = 0; i < intervals.length - 1; i++) {
        if (sortedIntervals[i].to + len <= sortedIntervals[i + 1].from) {
            gapIntervals.push({
                from: sortedIntervals[i].to,
                to: sortedIntervals[i + 1].from
            });
        }
    }

    return gapIntervals;
}

/**
 * Получить из расписания банка временные интервалы, когда он закрыт
 * @param {Object} workingHours - расписание банка
 * @returns {Array} - все интервалы, когда банк не работает (Или нельзя грабить)
 */
function getIntervalsWhenBankClosed(workingHours) {
    var timezone = parseInt(workingHours.from.split('+')[1], 10);
    var weekBegin = Date.parse('1 1 2007 00:00 GMT+' + timezone);
    var weekEnd = Date.parse('1 3 2007 23:59 GMT+' + timezone);

    return [
        { // Утро понедельника
            from: weekBegin,
            to: Date.parse(toGMTTimeString('ПН ' + workingHours.from))
        },
        { // Ночь понедельника и утро вторника
            from: Date.parse(toGMTTimeString('ПН ' + workingHours.to)),
            to: Date.parse(toGMTTimeString('ВТ ' + workingHours.from))
        },
        { // Ночь вторника и утро среды
            from: Date.parse(toGMTTimeString('ВТ ' + workingHours.to)),
            to: Date.parse(toGMTTimeString('СР ' + workingHours.from))
        },
        { // Оставшаяся неделя после среды (Нельзя грабить)
            from: Date.parse(toGMTTimeString('СР ' + workingHours.to)),
            to: weekEnd
        }
    ];
}

/**
 * Добиваем число нулями дл длины 2
 * @param {Number} time - количество часов или минут
 * @returns {String} - строка в формате HH или MM
 */
function padTime(time) {
    return time < 10 ? '0' + time : time.toString();
}

/**
 * Конкатенация всех записей из расписания в один массив
 * @param {Object} schedule - расписание банды
 * @returns {Array} - все интервалы в одном массиве
 */
function concatAllIntervalArrays(schedule) {
    return Object.keys(schedule)
        .reduce(function (concatenated, scheduleKey) {
            return concatenated.concat(schedule[scheduleKey]);
        }, []);
}

/**
 * Поиск подходящего момента для ограбления
 * @param {Object} schedule – Расписание Банды
 * @param {Number} duration - Время на ограбление в минутах
 * @param {Object} workingHours – Время работы банка
 * @param {String} workingHours.from – Время открытия, например, "10:00+5"
 * @param {String} workingHours.to – Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
exports.getAppropriateMoment = function (schedule, duration, workingHours) {
    console.info(schedule, duration, workingHours);

    var msDuration = duration * 60 * 1000;
    var bankClosed = getIntervalsWhenBankClosed(workingHours);
    var bankTimezone = parseInt(workingHours.from.split('+')[1], 10);

    var intervals = joinIntervals(
        concatAllIntervalArrays(schedule)
            .map(toTimeInterval)
            .concat(bankClosed)
    );

    return {
        currentId: 0,

        allGaps: getGaps(intervals, msDuration),

        get currentGap() {
            return this.allGaps[this.currentId];
        },

        /**
         * Найдено ли время
         * @returns {Boolean}
         */
        exists: function () {
            return this.allGaps.length > 0;
        },

        /**
         * @returns {boolean} - есть ли еще время для попытки грабежа
         */
        existsMore: function () {
            return this.currentId + 1 < this.allGaps.length;
        },

        /**
         * Возвращает отформатированную строку с часами для ограбления
         * Например,
         *   "Начинаем в %HH:%MM (%DD)" -> "Начинаем в 14:59 (СР)"
         * @param {String} template
         * @returns {String}
         */
        format: function (template) {
            return this.exists()
                ? formatDateInTimezone(template, this.currentGap, bankTimezone) : '';
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @star
         * @returns {Boolean}
         */
        tryLater: function () {
            if (this.exists()) {
                var oldId = this.currentId;
                var shiftedGap = this.currentGap.from + MS_IN_HOUR / 2;
                if (shiftedGap + msDuration <= this.currentGap.to) {
                    this.currentGap.from = shiftedGap;

                    return true;
                }
                this.currentId = this.currentId + this.existsMore();

                return this.currentId !== oldId;
            }

            return false;
        }
    };
};
