const Express = require('express');
const path = require('path');
const Promise = require('bluebird');
const Boom = require('boom');

const fs = require('fs-promise');

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
}
app.get('/:projectAlias', (req, res, next) => {
  const project = new Project(req.params.projectAlias);
  return project.isExist().then(
    () => Promise.all([
      project.getCss(),
      project.getHtml(),
    ]),
    error => next(Boom.notFound('project not found'))
  ).then(
    ([ css, html ]) => res.render('card', { html, css }),
    ( error ) => next(Boom.wrap(error))
  );
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.json(err);
})
module.exports = app;
