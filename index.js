var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var port = process.env.PORT || 5000;

var tasks =     {
	"1": { "id": '1', "text": "Send application" },
	"2": { "id": "2", "text": "HR interview" },
	"3": { "id": "3", "text": "Deploy a sample project to show your proficiency" },
	"9": { "id": "9", "text": "Get ready for further technical rounds" }
  };

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/api/tasks', function(req, res) {
	res.json(tasks);
});

app.post('/api/tasks', function(req, res) {
	console.log('POST a new Task', req.body);
	if (!req.body || !req.body.id || !req.body.text) {
		res.status(400).send('Invalid task format');
		return;
	}
	if (tasks[req.body.id]) {
		res.status(409).send('Conflict. Task already defined');
		return;
	}

	tasks[req.body.id] = {
		id: req.body.id,
		text: req.body.text
	};
	res.status(204).send();
});

app.put('/api/tasks/:id', function(req, res) {
	console.log('PUT a new Task', req.params.id, req.body);
        if (!tasks[req.params.id]) {
                res.status(404).send();
                return;
        }

	tasks[req.params.id].text = req.body.text;
	res.status(204).send();
});

app.delete('/api/tasks/:id', function(req, res) {
	if (!tasks[req.params.id]) {
		res.status(404).send();
		return;
	}

	delete tasks[req.params.id];
	res.status(204).send();
});

app.listen(port, function () {
	  console.log('To-Do app listening on port 5000!');
});
