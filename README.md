### Objective
Create a single page web application to manage a task list using plain JavaScript.

### Requirements
The application provides the functionality to view the list of to-do items, create them, and mark them as done. The front-end technology is based on JavaScript / HTML / CSS. Tasks are stored using a Rest service. Data transfer between web client and back-end service is realized too.

### Additional Information
The server-side implementation is done in Node.js. The API is documented below.
--------------------------------------------------------

# Back-end Service

## Overview

The back-end is based on [Express](http://http://expressjs.com/), a Node.js web application framework.


## Setup

To setup the server install Node.js in Version 4.4 or newer from the [Node.Js Website](http://nodejs.org/).
Then run the following command in the project root.
This downloads all required dependencies to run the Server.

```bash
npm install
```

## Run the Server

Run the following command in the project root:

```bash
npm start
```

## Server Interface Description

### Get index.html

This is the main entry point, the server delivers the index.html file which is located in the project's public folder.
Static files in public are served as well.

    GET /

#### Curl example

```bash
curl http://localhost:5000/
```

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
    Content-Type: application/json; charset=utf-8
    Content-Length: 43
    Date: Sun, 8 Oct 2017 09:52:06 GMT
    Connection: keep-alive

    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Todo App</title>
    <link rel = "stylesheet" type = "text/css" href = "stylesheets/app.css" />
    </head>
    <body onload="getUpdatedToDoList()">
    <center><h1>Todo App</h1></center>

    <!-- get all the tasks that's already defined -->
    <div class="container">
        <div>
        <label for="new-task">Add Item </label>
        <input id="new-task" type="text">
        <button onclick="addItemToList()">Add</button>
        </div>
        
        <div>
        <h3>Todo</h3>
        <ul id="incomplete-tasks"></ul>
        </div>
        
        <div>
        <h3>Completed</h3>
        <ul id="completed-tasks"></ul>
        </div>
    </div>

    </body>
    <script type="text/javascript" src="js/app.js"></script>


- - -


### Get a list of Tasks

This Method retrieves the list of tasks that the server currently knows about.
Restarting the server will reset the tasks since it is using an in memory storage solution.

    GET /api/tasks

#### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
    Content-Type: application/json; charset=utf-8
    Content-Length: 43
    Date: Sun, 8 Oct 2017 09:52:06 GMT
    Connection: keep-alive

    {
      "1": { "id": '1', "text": "Send application" },
      "2": { "id": "2", "text": "HR interview" },
      "3": { "id": "3", "text": "Deploy a sample project to show your proficiency" },
      "9": { "id": "9", "text": "Get ready for further technical rounds" }
    }

#### Curl example

```bash
curl http://localhost:5000/api/tasks
```


- - -


### Create a new Task

This will save the new task in the in memory storage.

    POST /api/tasks

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | the id of the tasks, must be unique |
| text | string | the text of the tasks |

#### Response

    HTTP/1.1 204 No Content
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
    Date: Sun, 8 Oct 2017 09:47:41 GMT
    Connection: keep-alive

#### Curl example

```bash
curl -i \
    -H "Content-Type: application/json" \
    -X POST \
    -d '{"id":"001","text":"my great task"}' \
    http://localhost:5000/api/tasks
```


- - -


### Update a Task

This will update the task in the in memory storage.

    PUT /api/tasks/:id

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| text | string | the new text of the tasks |

#### Response

    HTTP/1.1 204 No Content
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
    Date: Sun, 8 Oct 2017 09:52:06 GMT
    Connection: keep-alive

#### Curl example

```bash
curl -i \
    -H "Content-Type: application/json" \
    -X PUT \
     -d '{"id":"001","text":"my great new task"}' \
    http://localhost:5000/api/tasks/001
```


- - -


### Delete a Task

This method will delete the task in the in memory storage.

    DELETE /api/tasks/:id

#### Response

    HTTP/1.1 204 No Content
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
    Date: Sun, 8 Oct 2017 09:52:49 GMT
    Connection: keep-alive

#### Curl example

```bash
curl -i -X DELETE http://localhost:5000/api/tasks/001
```

#### Deployed version

```
https://basic-todoapp.herokuapp.com/
```

### Ideas for Improvement
Here are some ideas for this app that could be extended:

* Integrate calendar
* Categorize tasks as urgent, important, etc ...
* Use [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) .
Examples as shown in [DnD for File Uploading](https://css-tricks.com/drag-and-drop-file-uploading/) and [DnD for Car Parking Game](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)


I would love to see contributions (checkout below how to do it!) and improvements.

### Contributing
* Fork it ( https://github.com/w1n5rx/ToDoApp/fork )
* Create your feature branch (git checkout -b my-new-feature)
* Commit your changes (git commit -am 'Add some feature')
* Push to the branch (git push origin my-new-feature)
* Create a new Pull Request