'use strict';

/**
 * Возвращает круги друзей Билли
 * @param {Array} friends - все друзья
 * @returns {Array} - круги друзей
 */
function getWaves(friends) {
    var waves = [];
    var friendsDict = {};
    var currentWave = [];

    friends.forEach(function (friend) {
        if (friend.best) {
            currentWave.push(friend);
        } else {
            friendsDict[friend.name] = friend;
        }
    });

    var getNextWave = function () {
        return currentWave.reduce(function (wave, friend) {
            friend.friends.forEach(function (friendOfFriend) {
                if (friendOfFriend in friendsDict) {
                    wave.push(friendsDict[friendOfFriend]);
                    delete friendsDict[friendOfFriend];
                }
            });

            return wave;
        }, []);
    };

    while (currentWave.length !== 0) {
        waves.push(currentWave.sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
        }));
        currentWave = getNextWave();
    }

    return waves;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends - массив друзей
 * @param {Filter} filter - фильтр друзей
 */
function FilteredIterator(friends, filter) {
    this.friends = friends;
    this.filter = filter;
    this.next = function () {
        var friend = this.friends.shift();
        while (friend !== undefined && !this.filter.test(friend)) {
            friend = this.friends.shift();
        }

        return friend ? friend : null;
    };
    this.done = function () {
        var friend = this.next();
        if (friend) {
            this.friends.unshift(friend);
        }

        return friend === null;
    };
}

/**
 * Итератор по друзьям
 * с хорошим порядком обхода (Как хочет Билли)
 * (На самом деле цепь из FilteredIterator'ов)
 * @constructor
 * @param {Object[]} friends - массив друзей
 * @param {Filter} filter - фильтр друзей
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.filter = filter;
    this.waves = getWaves(friends);
    this.waveIndex = 0;
    var firstWave = this.waves.length ? this.waves[this.waveIndex++] : [];
    this.currentWaveIterator = new FilteredIterator(
        firstWave, filter
    );
    this.done = function () {
        var isWaveDone = this.currentWaveIterator.done();
        var isLastWave = this.waveIndex === this.waves.length;

        return isWaveDone && isLastWave;
    };
    this.next = function () {
        if (this.done()) {
            return null;
        }
        if (this.currentWaveIterator.done()) {
            this.currentWaveIterator = new FilteredIterator(
                this.waves[this.waveIndex++], this.filter
            );
        }

        return this.currentWaveIterator.next();
    };
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends - все друзья
 * @param {Filter} filter - фильтр
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.call(this, maxLevel > 0 && maxLevel ? friends : [], filter);
    this.waves = this.waves.slice(0, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.test = function () {
        return true;
    };
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.test = function (element) {
        return element.gender === 'male';
    };
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.test = function (element) {
        return element.gender === 'female';
    };
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
