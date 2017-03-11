/* eslint-env mocha */
'use strict';

var assert = require('assert');

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

describe('Итераторы', function () {
    it('должны обойти в правильном порядке друзей и составить пары', function () {
        var maleFilter = new lib.MaleFilter();
        var femaleFilter = new lib.FemaleFilter();
        var maleIterator = new lib.LimitedIterator(friends, maleFilter, 2);
        var femaleIterator = new lib.Iterator(friends, femaleFilter);

        var invitedFriends = [];
        while (!maleIterator.done() && !femaleIterator.done()) {
            invitedFriends.push([
                maleIterator.next(),
                femaleIterator.next()
            ]);
        }
        while (!femaleIterator.done()) {
            invitedFriends.push(femaleIterator.next());
        }

        assert.deepStrictEqual(invitedFriends, [
            [friend('Sam'), friend('Sally')],
            [friend('Brad'), friend('Emily')],
            [friend('Mat'), friend('Sharon')],
            friend('Julia')
        ]);
    });

    function friend(name) {
        var len = friends.length;
        while (len--) {
            if (friends[len].name === name) {
                return friends[len];
            }
        }
    }
});
