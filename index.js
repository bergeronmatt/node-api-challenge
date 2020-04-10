
//set up server object

const express = require('express');
const server = express();

const projectRoutes = require('./routes/projects.js');
const actionRoutes = require('./routes/actions.js');

server.use(express.json());



const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`===SERVER LISTENING ON http://localhost:${5000}===`)
})

server.use('/api/projects', projectRoutes);
server.use('/api/actions', actionRoutes);

//sanity test
server.get('/', (req, res) => {
    res.send('<h1> NODE API SPRINT </h1>');
});