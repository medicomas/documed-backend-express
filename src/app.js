const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// middlewares or routes
// e.g. 

app.get('/', (req, res) => {
  res.send('welcome 2 documed!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
