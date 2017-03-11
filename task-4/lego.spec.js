/* eslint-env mocha */
'use strict';

var assert = require('assert');

var lego = require('./lego');
var friends = [
    {
        name: 'Сэм',
        age: 29,
        gender: 'Мужской',
        email: 'luisazamora@example.com',
        phone: '+7 (555) 505-3570',
        favoriteFruit: 'Картофель'
    },
    {
        name: 'Эмили',
        age: 30,
        gender: 'Женский',
        email: 'example@example.com',
        phone: '+7 (555) 539-2625',
        favoriteFruit: 'Яблоко'
    },
    {
        name: 'Мэт',
        age: 27,
        gender: 'Мужской',
        email: 'danamcgee@example.com',
        phone: '+7 (555) 526-2845',
        favoriteFruit: 'Яблоко'
    },
    {
        name: 'Брэд',
        age: 28,
        gender: 'Мужской',
        email: 'newtonwilliams@example.com',
        phone: '+7 (555) 519-3304',
        favoriteFruit: 'Банан'
    },
    {
        name: 'Шерри',
        age: 27,
        gender: 'Женский',
        email: 'danamcgee@example.com',
        phone: '+7 (555) 526-2845',
        favoriteFruit: 'Картофель'
    },
    {
        name: 'Керри',
        age: 36,
        gender: 'Женский',
        email: 'danamcgee@example.com',
        phone: '+7 (555) 526-2845',
        favoriteFruit: 'Апельсин'
    },
    {
        name: 'Стелла',
        age: 25,
        gender: 'Женский',
        email: 'waltersguzman@example.com',
        phone: '+7 (555) 415-3100',
        favoriteFruit: 'Картофель'
    }
];

describe('lego.query', function () {
    it('должен вернуть отобранные и отсортированные записи', function () {
        var result = lego.query(
            friends,
            lego.select('name', 'gender', 'email'),
            lego.filterIn('favoriteFruit', ['Яблоко', 'Картофель']),
            lego.sortBy('age', 'asc'),
            lego.format('gender', function (value) {
                return value[0];
            }),
            lego.limit(4)
        );

        assert.deepStrictEqual(result, [
            { name: 'Стелла', gender: 'Ж', email: 'waltersguzman@example.com' },
            { name: 'Мэт', gender: 'М', email: 'danamcgee@example.com' },
            { name: 'Шерри', gender: 'Ж', email: 'danamcgee@example.com' },
            { name: 'Сэм', gender: 'М', email: 'luisazamora@example.com' }
        ]);
    });

    if (lego.isStar) {
        it('должен поддерживать операторы or и and', function () {
            var result = lego.query(
                friends,
                lego.select('name'),
                lego.or(
                    lego.and(
                        lego.filterIn('gender', ['Мужской']),
                        lego.filterIn('favoriteFruit', ['Картофель'])
                    ),
                    lego.and(
                        lego.filterIn('gender', ['Женский']),
                        lego.filterIn('favoriteFruit', ['Яблоко'])
                    )
                )
            );

            assert.deepStrictEqual(result, [
                { name: 'Сэм' },
                { name: 'Эмили' }
            ]);
        });
    }
});
