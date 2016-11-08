const Express = require('express');
const path = require('path');
const Promise = require('bluebird');
const Boom = require('boom');
const fs = require('fs-promise');
const ejs = require('ejs');

const langs = require('./configs/card.json');
const app = Express.Router(); // eslint-disable-line

class Project {
  constructor (name) {
    this.name = name;
  }
  get path () {
    return path.resolve(process.cwd(), 'projects', this.name);
  }
  isExist () {
    return fs.access(this.path, fs.F_OK);
  }
  getCss() {
    return fs.readFile(path.resolve(this.path, 'card.css'), 'utf8');
  }
  getHtml() {
    return fs.readFile(path.resolve(this.path, 'card.html'), 'utf8');
  }
  getJson() {
    return fs.readFile(path.resolve(this.path, 'card.json'), 'utf8').then((resp) => JSON.parse(resp));
  }
}

function translateWith (langpack) {
  return function (key) {
    return langpack[key];
  }
}

app.get('/:projectAlias', (req, res, next) => {
  let lang = 'en';
  if (langs[req.query.lang]) {
    lang = req.query.lang;
  }
  const langpack = langs[lang];
  if(!langpack) throw new Error('undefined langpack');

  const project = new Project(req.params.projectAlias);
  return project.isExist().then(
    () => project.getJson().catch(() => ({})),
    error => next(Boom.notFound('project not found'))
  ).then(
    (projectJson) => Promise.all([
      project.getCss(),
      project.getHtml().then(resp => ejs.render(resp, { t: translateWith(projectJson[lang]) })),
    ])
  ).then(
    ([ css, html ]) => res.render('card', { html, css, langpack: escape(JSON.stringify(langpack)) }),
    ( error ) => next(Boom.wrap(error))
  );
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.json(err);
})
module.exports = app;
