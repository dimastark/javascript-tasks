'use strict';

exports.isStar = true;
var flow = require('flow');
var GithubRepositoriesAPI = require('./api.js');

var API = new GithubRepositoriesAPI('urfu-2016', 'token.txt');

/**
 * Получение списка задач
 * @param {String} category – категория задач (javascript или markup)
 * @param {Function} callback
 */
exports.getList = function (category, callback) {
    API.getAllTasksInfoByCategory(category, function (error, data) {
        if (error) {
            callback(error);
        } else {
            callback(null, data.map(function (repo) {
                return { name: repo.name, description: repo.description };
            }));
        }
    });
};

/**
 * Загрузка одной задачи
 * @param {String} taskName – идентификатор задачи
 * @param {Function} callback
 */
exports.loadOne = function (taskName, callback) {
    var task = {};
    flow.serial([
        API.getTaskInfoByName.bind(global, taskName),

        function (repository, cb) {
            task.name = repository.name;
            task.description = repository.description;
            cb();
        },

        API.getTaskReadmeByName.bind(global, taskName),

        function (markdown, cb) {
            task.markdown = markdown;
            cb();
        },

        function (cb) {
            API.renderMarkdown(task.markdown, cb);
        },

        function (renderedMarkdown, cb) {
            task.html = renderedMarkdown;
            cb(null, task);
        }
    ], callback);
};
