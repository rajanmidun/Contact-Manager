const express = require('express');
require('express-async-errors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

//HANDLING OTHER ERRORS
require('./logging/logger')();

//CONNECTION TO DATABASE
require('./config/db')();

//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//DEFINING ROUTES
app.use('/api/users', require('./routes/user'));
app.use('/api/contacts', require('./routes/contact'));
app.use('/api/auths', require('./routes/auth'));
app.use(require('./middleware/error'));

//SERVE STATIC ASSETS IN PRODUCTION
if (process.env.Node_ENV === 'production') {
  //set static folder
  app.use(express.static('/client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});