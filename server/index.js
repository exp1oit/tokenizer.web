const Express = require('express');
const path = require('path');
const cardApp = require('./card');

const server = new Express();

server.set('port', process.env.PORT || 3000);
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use('/public', Express.static(path.resolve(process.cwd(), 'public')));

server.get('/', (req, res) => {
  res.json({
    message: 'Tokenizer.web Application',
  });
});

server.use('/cards', cardApp);

server.listen(server.get('port'), function (err) {
  if (err) {
    console.log('application start error', err.message);
  }
  console.log(`application started at 0.0.0.0:${server.get('port')}`);
});
