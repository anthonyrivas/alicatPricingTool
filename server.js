require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/api/parts', (req, res) => {
  const data = req.body;
  axios
    .post('https://partapi20190311115558.azurewebsites.net/api/parts', data)
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
