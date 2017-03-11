/* eslint-disable max-len */
'use strict';

var tasks = require('./tasks');

// Загружаем список файлов
tasks.getList('javascript', function (err, items) {
    // Обрабатываем ошибку
    if (err) {
        return handleError(err);
    }

    // Обрабатываем результат
    items.forEach(function (task) {
        console.info('%s: %s', task.name, task.description);
    });
    // Выведет:
    // javascript-task-1: Задача «XXL»
    // javascript-task-2: Задача «Телефонная книга»
    // javascript-task-3: Задача «0b11 друзей Оушена»
    // javascript-task-4: Задача «Картофельная вечеринка Билли»
    // ...
});

tasks.loadOne('javascript-task-1', function (err, task) {
    // Обрабатываем ошибку
    if (err) {
        return handleError(err);
    }

    // Обрабатываем результат
    console.info('Name: %s', task.name);
    console.info('Description: %s', task.description);

    console.info('Text in markdown:\n%s', task.markdown);
    // Выведет:
    // # Задача «XXL»
    //
    // Перед выполнением задания внимательно прочитайте:
    // ...

    if (tasks.isStar) {
        console.info('Text in html:\n%s', task.html);
        // Выведет:
        // <h1>
        // <a id="user-content-Задача-xxl" class="anchor" href="#%D0%97%D0%B0%D0%B4%D0%B0%D1%87%D0%B0-xxl" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Задача «XXL»</h1>
        //
        // <p>Перед выполнением задания внимательно прочитайте:</p>
        // ...
    }
});

function handleError(err) {
    console.error(err);
    console.error(err.stack);
}
