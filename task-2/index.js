'use strict';

var phoneBook = require('./phone-book');

// Эти записи добавятся, вернется true
phoneBook.add('5554440044', 'Григорий', 'grisha@example.com');
phoneBook.add('5552220022', 'Борис', 'boris@example.com');
phoneBook.add('5551110011', 'Алекс');
phoneBook.add('5553330033', 'Валерий', 'valera@example.com');

// Эти запись не добавятся
phoneBook.add('3330033', 'Неизвестный', 'unknown@example.com');
phoneBook.add('5551110011', 'Алексей');
phoneBook.add('5555550055');

// Обновление
phoneBook.update('5551110011', 'Алексей', 'alex@example.com');
phoneBook.update('5553330033', 'Валерий');

// В следующих примерах вернутся все записи
console.info(phoneBook.find('*'));
console.info(phoneBook.find('555'));
// Вывод будет следующий
// [
//   'Алексей, +7 (555) 111-00-11, alex@example.com',
//   'Борис, +7 (555) 222-00-22, boris@example.com',
//   'Валерий, +7 (555) 333-00-33',
//   'Григорий, +7 (555) 444-00-44, grisha@example.com'
// ]

// Удаление
phoneBook.findAndRemove('@'); // returns 3

if (phoneBook.isStar) {
    // Импортируем из csv
    var csv = [
        'Борис;5552220022;boris@example.com',
        'Григорий;5554440044;grisha@example.com',
        'Алексей;5551110011;alex@example.com',
        'Валерий;5553330033;valera@example.com',
        'Неизвестный;3330033;unknown@example.com'
    ].join('\n');
    phoneBook.importFromCsv(csv); // returns 4
}
