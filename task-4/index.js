'use strict';

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
        email: 'roachpugh@example.com',
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

// Находим настоящих друзей
var bestFriends = lego.query(

    // среди всех друзей.
    friends,

    // Выбираем имена и email для праздничной рассылки
    lego.select('name', 'gender', 'email'),

    // Отбираем только тех, кто любит Яблоки или Картофель (самое важное !!!)
    lego.filterIn('favoriteFruit', ['Яблоко', 'Картофель']),

    // Отсортируем их по возрасту (но зачем?)
    lego.sortBy('age', 'asc'), // Бывает только asc (от меньшего к большему) или desc (наоборот)

    // А пол выведем только первой буквой для удобства
    lego.format('gender', function (value) {
        return value[0];
    }),

    // Настоящих друзей не может быть много
    lego.limit(4)
);

console.info(bestFriends);

/* Выведет:
[
    { name: 'Стелла', gender: 'Ж', email: 'waltersguzman@example.com' },
    { name: 'Мэт', gender: 'М', email: 'danamcgee@example.com' },
    { name: 'Шерри', gender: 'Ж', email: 'danamcgee@example.com' },
    { name: 'Сэм', gender: 'М', email: 'luisazamora@example.com' }
]
*/

if (lego.isStar) {
    // Билли был бы по-настоящему счастлив, если бы ему удалось провести сразу две вечеринки:
    // Яблочную для девушек и картофельную для парней
    bestFriends = lego.query(
        friends,

        lego.select('name'),

        // Выбираем всех парней, которые любят картофель, и всех девушек, которые любят яблоки
        lego.or(
            // Должно сработать хотябы одно условие
            lego.and(
                // Должны сработать оба условия
                lego.filterIn('gender', ['Мужской']),
                lego.filterIn('favoriteFruit', ['Картофель'])
            ),
            lego.and(
                lego.filterIn('gender', ['Женский']),
                lego.filterIn('favoriteFruit', ['Яблоко'])
            )
        )
    );

    console.info(bestFriends);

    /* Выведет
     [
         { name: 'Сэм' },
         { name: 'Эмили' },
         { name: 'Мэт' },
         { name: 'Шерри' },
         { name: 'Стелла' }
     ]
     */
}
