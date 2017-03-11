'use strict';

var lib = require('./lib');

var friends = [
    {
        name: 'Sam',
        friends: ['Mat', 'Sharon'],
        gender: 'male',
        best: true
    },
    {
        name: 'Sally',
        friends: ['Brad', 'Emily'],
        gender: 'female',
        best: true
    },
    {
        name: 'Mat',
        friends: ['Sam', 'Sharon'],
        gender: 'male'
    },
    {
        name: 'Sharon',
        friends: ['Sam', 'Itan', 'Mat'],
        gender: 'female'
    },
    {
        name: 'Brad',
        friends: ['Sally', 'Emily', 'Julia'],
        gender: 'male'
    },
    {
        name: 'Emily',
        friends: ['Sally', 'Brad'],
        gender: 'female'
    },
    {
        name: 'Itan',
        friends: ['Sharon', 'Julia'],
        gender: 'male'
    },
    {
        name: 'Julia',
        friends: ['Brad', 'Itan'],
        gender: 'female'
    }
];

// Создаем фильтры парней и девушек
var maleFilter = new lib.MaleFilter();
var femaleFilter = new lib.FemaleFilter();

// Создаем итераторы
var femaleIterator = new lib.Iterator(friends, femaleFilter);

// Среди парней приглашаем только луших друзей и друзей лучших друзей
var maleIterator = new lib.LimitedIterator(friends, maleFilter, 2);

var invitedFriends = [];

// Собираем пары «парень + девушка»
while (!maleIterator.done() && !femaleIterator.done()) {
    invitedFriends.push([
        maleIterator.next(),
        femaleIterator.next()
    ]);
}

// Если остались девушки, то приглашаем остальных
while (!femaleIterator.done()) {
    invitedFriends.push(femaleIterator.next());
}

console.info(invitedFriends);
// Sam, Julia
// Brad, Emily
// Mat, Sharon
// Julia
