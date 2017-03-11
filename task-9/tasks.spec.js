/* eslint-env mocha */
/* eslint-disable no-shadow, max-nested-callbacks */
'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var nock = require('nock');

var tasks = require('./tasks');

var reposPayload = require('./payloads/repos');
var repoPayload = require('./payloads/repo');
var readmePayload = require('./payloads/readme');

var md = fs.readFileSync(path.join(__dirname, 'payloads', 'readme.md'), { encoding: 'utf-8' });
var html = fs.readFileSync(path.join(__dirname, 'payloads', 'readme.md'), { encoding: 'utf-8' });

nock('https://api.github.com')
    .get('/orgs/urfu-2016/repos')
    .query(true)
    .reply(200, reposPayload)

    .get('/repos/urfu-2016/javascript-task-1')
    .query(true)
    .reply(200, repoPayload)

    .get('/repos/urfu-2016/javascript-task-1/readme')
    .query(true)
    .reply(200, readmePayload)

    .post('/markdown/raw', /«XXL»/)
    .query(true)
    .reply(200, html)
;

describe('tasks', function () {
    it('должен возвращать список задач по категории', function (done) {
        tasks.getList('javascript', function (err, data) {
            assert.ifError(err);

            var tasks = {
                1: 'Задача «XXL»',
                2: 'Задача «Телефонная книга»',
                3: 'Задача «0b11 друзей Оушена»',
                4: 'Задача «Картофельная вечеринка Билли»',
                5: 'Задача «Пора на лекцию»',
                7: 'Задача «Свадьба Билли»',
                8: 'Задача «Котофайлы»'
            };

            var expected = Object.keys(tasks).map(function (number) {
                return {
                    name: 'javascript-task-' + number,
                    description: tasks[number]
                };
            });
            assert.deepStrictEqual(data, expected);

            done();
        });
    });

    it('должен возвращать информацию по задаче', function (done) {
        tasks.loadOne('javascript-task-1', function (err, task) {
            assert.ifError(err);

            assert.strictEqual(task.name, 'javascript-task-1');
            assert.strictEqual(task.description, 'Задача «XXL»');
            assert.strictEqual(task.markdown, md);

            if (tasks.isStar) {
                assert.strictEqual(task.html, html);
            }

            done();
        });
    });
});
