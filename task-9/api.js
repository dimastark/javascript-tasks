'use strict';

var fs = require('fs');
var path = require('path');
var request = require('request');

var GITHUB_URL = 'https://api.github.com';
var REVIVER_FUNCTIONS = {
    raw: function (data, callback) {
        callback(null, data);
    },
    base64content: function (data, callback) {
        var parsed = JSON.parse(data);
        var buffer = new Buffer(parsed.content, 'base64');
        callback(null, buffer.toString('utf-8'));
    },
    json: function (data, callback) {
        callback(null, JSON.parse(data));
    }
};

/**
 * Является ли репозиторий заданием с нужной категорией
 * @param {String} category - имя категории
 * @param {Object} repository - репозиторий объект
 * @returns {boolean}
 */
function isCategoryTaskRepository(category, repository) {
    return repository.name.lastIndexOf(category + '-task') === 0;
}

/**
 * Пытаемся получить токен из файла
 * @param {String} tokenFileName - имя файла с токеном
 * @returns {String} - токен или пустая строка, если его нет
 */
function tryGetToken(tokenFileName) {
    var tokenPath = path.join(__dirname, tokenFileName);
    try {
        return fs.readFileSync(tokenPath, 'utf-8').trim();
    } catch (e) {
        return '';
    }
}

/**
 * Создаем строку запроса к апи
 * Нету шаблонных строк - костыляем как можем
 * @param {Array<String>} pathParts - части запроса
 * @param {String} [query] - query string
 * @returns {String} - запрос
 */
function makeUrl(pathParts, query) {
    return pathParts.reduce(function (processedUrl, part) {
        return processedUrl + '/' + part;
    }, GITHUB_URL) + (query ? query : '');
}

/**
 * Сделать запрос
 * @param {String} url - ссылка
 * @param {Function} reviver - функция для обработки ответа
 * @param {Function} callback
 * @param {String} [postText] - POST данные
 */
function makeRequest(url, reviver, callback, postText) {
    var userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0';
    var options = {
        url: url,
        headers: { 'User-Agent': userAgent }
    };
    if (postText) {
        options.method = 'POST';
        options.body = postText;
        options.headers['Content-Length'] = Buffer.byteLength(postText);
        options.headers['Content-Type'] = 'text/plain';
    }
    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            callback(error || new Error('Bad response'));
        } else {
            reviver(body, callback);
        }
    });
}

/**
 * Обертка для работы с api GitHub'а
 * @param {String} organisation - организация, с репозиториями которой будем работать
 * @param {String} tokenFileName - файл с токеном
 * @constructor
 */
function GithubRepositoriesAPI(organisation, tokenFileName) {
    var token = tryGetToken(tokenFileName);
    var authString = token ? '?access_token=' + token : '';

    this.getAllTasksInfoByCategory = function (category, callback) {
        var url = makeUrl(['orgs', organisation, 'repos'], authString);
        var taskFilter = isCategoryTaskRepository.bind(null, category);
        makeRequest(url, REVIVER_FUNCTIONS.json, function (error, data) {
            if (error) {
                callback(error);
            } else {
                callback(null, data.filter(taskFilter));
            }
        });
    };

    this.getTaskInfoByName = function (taskName, callback) {
        var url = makeUrl(['repos', organisation, taskName], authString);
        makeRequest(url, REVIVER_FUNCTIONS.json, callback);
    };

    this.getTaskReadmeByName = function (taskName, callback) {
        var url = makeUrl(['repos', organisation, taskName, 'readme'], authString);
        makeRequest(url, REVIVER_FUNCTIONS.base64content, callback);
    };

    this.renderMarkdown = function (markdownText, callback) {
        var url = GITHUB_URL + '/markdown/raw';
        makeRequest(url, REVIVER_FUNCTIONS.raw, callback, markdownText);
    };
}

module.exports = GithubRepositoriesAPI;
