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

    $scope.saveToServer = function(){
        Parse.initialize("h0nInCRMjPpriC1lfoE6gGQJhv8jFMCUs6kQniec", "LeC7rRKt4zvugfKQMKEgDcrdhdCR7MA5ofcaUlRU");
        var tasks = Parse.Object.extend("tasks");
        var task = new tasks();
        task.save({task_id: $scope.tasks.length+1 , title: $scope.formTodoText, description: $scope.formTodoDesc, done: false}).then(function(object) {
            alert("Task was added!");
        });
    };

    $scope.readFromServer = function(){
        Parse.initialize("h0nInCRMjPpriC1lfoE6gGQJhv8jFMCUs6kQniec", "LeC7rRKt4zvugfKQMKEgDcrdhdCR7MA5ofcaUlRU");
        var tasks = Parse.Object.extend("tasks");
        var query = new Parse.Query(tasks);
        query.find({
            success:function(results) {
                for(var i=0;i<results.length;i++)
                {
                    var object= results[i];
                    $scope.tasks.push({'task_id':object.get('task_id') , 'createdAt':object.get('createdAt') ,
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

    $scope.task_id = $routeParams.taskID;

    $scope.getTotalTodos = function () {
        return $scope.tasks.length;
    };

    $scope.clearCompleted = function () {

            $scope.tasks = $scope.tasks.filter(function(todo){
                Parse.initialize("h0nInCRMjPpriC1lfoE6gGQJhv8jFMCUs6kQniec", "LeC7rRKt4zvugfKQMKEgDcrdhdCR7MA5ofcaUlRU");
                var tasks = Parse.Object.extend("tasks");
                var query = new Parse.Query(tasks);
                query.equalTo(todo.done, true);
                query.find({
                    success: function(result) {
                        result.destroy({
                            success: function(object) {
                                alert('Delete Successful');
                            },
                            error: function(object, error) {
                                alert('Delete failed');
                            }
                        });
                    },
                    error: function(error) {
                        alert('Error in delete query');
                    }
                });
            return !todo.done;
        });
    };

});