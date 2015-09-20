var toDoApp = angular.module('to_do_App', ['ngRoute']);
toDoApp.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'pages/main.html',
            controller  : 'mainController'
        })
        .when('/task/:taskID', {
            templateUrl : 'pages/task.html',
            controller  : 'mainController'
        });
});

toDoApp.controller('mainController', function($scope, $routeParams) {

    $scope.tasks = [];
    $scope.task_id = $routeParams.taskID;

    //save a task to Parse DB
    $scope.saveToServer = function(){
        Parse.initialize("h0nInCRMjPpriC1lfoE6gGQJhv8jFMCUs6kQniec", "LeC7rRKt4zvugfKQMKEgDcrdhdCR7MA5ofcaUlRU");
        var tasks = Parse.Object.extend("tasks");
        var task = new tasks();
        task.save({task_id: $scope.tasks.length+1 , title: $scope.formTodoText, description: $scope.formTodoDesc, done: false}).then(function(object) {
            alert("Task was added!");
            location.reload();
        });
    };

    //read all the tasks from Parse DB
    $scope.readFromServer = function(){
        Parse.initialize("h0nInCRMjPpriC1lfoE6gGQJhv8jFMCUs6kQniec", "LeC7rRKt4zvugfKQMKEgDcrdhdCR7MA5ofcaUlRU");
        var tasks = Parse.Object.extend("tasks");
        var query = new Parse.Query(tasks);
        query.find({
            success:function(results) {
                for(var i=0;i<results.length;i++)
                {
                    var object= results[i];
                    $scope.tasks.push({'id':object.id ,'task_id':object.get('task_id') , 'createdAt':object.get('createdAt') ,
                        'title':object.get('title') ,'description':object.get('description'), 'done':object.get('done')});
                }
                $scope.$apply();
                $scope.counter++;
            },
            error:function(error) {
                alert("error:"+ error.code +" "+error.message);
            }
        });
    };

    //get the number of the tasks
    $scope.getTotalTodos = function () {
        return $scope.tasks.length;
    };

    //remove done tasks from the scope and call for function to remove each done task
    $scope.removeCompleted = function(){
        $scope.tasksToRemove = $scope.tasks.filter(function(todo) {
            return todo.done;
        });
        $scope.tasks = $scope.tasks.filter(function(todo) {
            return !todo.done;
        });
        $scope.tasksToRemove.forEach(function(task) {
            $scope.killObj(task.id);
        });
    };

    //remove row from Parse DB by objectId
    $scope.killObj = function(objectId){
        Parse.initialize("h0nInCRMjPpriC1lfoE6gGQJhv8jFMCUs6kQniec", "LeC7rRKt4zvugfKQMKEgDcrdhdCR7MA5ofcaUlRU");
        var tasks = Parse.Object.extend("tasks");
        var query = new Parse.Query(tasks);
        query.equalTo('done', false);
        query.get(objectId, {
            success: function(myObj) {
                alert('Task in ID: ' + objectId + ' was Deleted successfully');
                myObj.destroy({});
            },
            error: function(object, error) {
                alert('Task in ID: '+ objectId + ' was not Deleted! reason: ' + error);
            }
        });
    };
});