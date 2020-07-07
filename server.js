const app = require('./app');
const { con } = require('./config');

app.set('PORT', (process.env.PORT || 4000));

const sql = 'DELETE FROM blocked';
const query = con.query({
  sql,
  timeout: 10000,
});
query.on('result', () => {});
console.log('cleared all tables');
app.listen(app.get('PORT'), () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at ${app.get('PORT')}`);
});
