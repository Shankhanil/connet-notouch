const app = require('./app');

app.set('PORT', (process.env.PORT || 4000));

app.listen(app.get('PORT'), () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at ${app.get('PORT')}`);
});
