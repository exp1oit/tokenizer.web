import Express from 'express';

const app = new Express();

app.set('port', process.env.PORT || 3000);

app.listen(function (err) {
  if (err) {
    console.log('application start error', err.message);
  }
  console.log(`application started at 0.0.0.0:${app.get('port')}`);
});
