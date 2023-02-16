const express = require('express');
const corsUtils = require('./utils/cors.js');
const environementLoader = require('./environements/environement.js');

const environement = environementLoader.load();

////////////////////////////////////////////
// CORS + JSON
////////////////////////////////////////////

const app = express();
app.use(express.json()) //Notice express.json middleware
corsUtils.setCors(app);
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////

const main = () => {
  const fs = require('fs');

  let routes = [... fs.readdirSync('./routes')]
    .filter(x => !['example.js'].includes(x)  && x.endsWith('.js'))
    .map(x => [x, require(`./routes/${x}`)])
    .map(x => ({ name: x[0].replace('.js', ''), use: Object.values(x[1])[0], type: 'normal' }));

  [... routes, ... routesDeprecrated].forEach(routeUseFunction => {
    routeUseFunction.use(app, environement);

    let method = routeUseFunction.name.split('-', 1)[0];
    let path = routeUseFunction.name.replace(`${method}-`, '');
    console.log(`[GraphLinq Node - API] - ${method} - ${path}`);
  });
};

////////////////////////////////////////////
// SERVER
////////////////////////////////////////////

const PORT = process.env.PORT || environement?.PORT || 8080;
app.listen(PORT, console.log(`[GraphLinq Node - API] - Start Server Port ${PORT}`));
