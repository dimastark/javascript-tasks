# Задача «Просмотрщик задач»

Перед выполнением задания внимательно прочитайте:

- [О всех этапах проверки задания](https://github.com/urfu-2016/guides/blob/master/workflow/overall.md)
- [Как отправить пулл](https://github.com/urfu-2016/guides/blob/master/workflow/pull.md)
- [Как пройти тесты](https://github.com/urfu-2016/guides/blob/master/workflow/test.md)
- Правила оформления [javascript](https://github.com/urfu-2016/guides/blob/master/codestyle/js.md), [HTML](https://github.com/urfu-2016/guides/blob/master/codestyle/html.md) и [CSS](https://github.com/urfu-2016/guides/blob/master/codestyle/css.md) кода

## Основное задание

> Мы очень хотим, чтобы код вы написали сами, а не пользовались внешними библиотеками.

Настоящие разработчики редко пользуются web-интерфейсами и предпочитают командную строку.  
Даже погоду и текущую фазу луны смотрят в окне терминала (смотри картинку внизу).

Предлагаем вам последовать за хорошей традицией  
и написать небольшой модуль для получения информации о задачах курса.

Для решения задачи вам понадобится [Github API](https://developer.github.com/v3/).

Для безопасного взаимодействия с ним необходимо получить **авторизационный token**  
и положить его в файл `token.txt` (исключение в *.gitignore* мы уже добавили).

> Для выполения запросов к API необходимо брать токен из файла,  
и ни в коем случае не оставлять его где-либо в коде!

И так, предлагаем для начала реализовать пару полезных функций.

### Функция getList

Принимает на вход категорию задачи: **demo**, **javascript** или **markup**.  
А на выходе возвращает список задач этой категории с названием и описанием:  

```
javascript-task-1: Задача «XXL»
javascript-task-2: Задача «Телефонная книга»
javascript-task-3: Задача «0b11 друзей Оушена»
javascript-task-4: Задача «Картофельная вечеринка Билли»
...
```

Необходимый интерфейс возьмите из следующего раздела документации:
- [List your repositories](https://developer.github.com/v3/repos/#list-your-repositories)

#### Функция loadOne

Принимает на вход название репозитория. Например, *javascript-task-1*.  
А на выходе возвращает объект с информацией:

```js
{
    name: 'javascript-task-1', // Название репозитория
    description: 'Задача «XXL»', // Описание
    markdown: '# Задача «XXL» ...' // И markdown из README.md
}
```

Необходимые интерфейсы возьмите из следующих разделов документации:  
- [Get repo](https://developer.github.com/v3/repos/#get)
- [Get the README](https://developer.github.com/v3/repos/contents/#get-the-readme)

#### Условия и ограничения

- Можно пользоваться только встроенными модулями Node.js  
и **своим** модулем `flow` из предыдущей задачи  
(по возможности установите его средствами npm, используя git URL).
- Можно использовать только рекомендованные в тексте задачи интерфейсы GitHub API.  
Любые другие будут блокироваться в тестах.
- Выполнение запросов к API обязательно изолируйте в **отдельный модуль**.
- А так же обязательно обрабатывайте различные ошибки.  
Например, неудачное сетевое соединение до API.

Примеры с подробными комментариями можно традиционно найти в __index.js__ и в тестах.

## Дополнительное задание

> Перед выполнением внимательно прочитайте [про особенности](https://github.com/urfu-2016/guides/blob/master/workflow/extra.md)

Очень круто, если вместе с markdown разметкой текста задачи,  
вы будете возвращать и html представление в отдельном поле:  
```js
{
    name: 'javascript-task-1',
    description: 'Задача «XXL»',
    markdown: '# Задача «XXL» ...',
    html: '<h1>Задача «XXL»</h1> ...'
}
```

Интерфейс для этого описан в разделе [Render a Markdown document in raw mode](https://developer.github.com/v3/markdown/#render-a-markdown-document-in-raw-mode)

Пример с подробными комментариями можно найти в __index.js__ и в тестах.

<img width="1264" alt="" src="https://cloud.githubusercontent.com/assets/4534405/20875529/3fe05294-badd-11e6-8e8d-18c4d33e8f4e.png">
