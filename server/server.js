const express         = require('express')
      , path          = require('path')
      , http          = require('http')
      , chalk         = require('chalk');

const app = express();

app.use('/dist', express.static(__dirname + '/../dist'));


app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

const port = process.env.PORT || '3000';

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(chalk.green(`Server running on http://localhost:${port}`));
});