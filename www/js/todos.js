var todos = [];

$('#todos-refresh-btn').click(function(){
    refreshTodos();
});

$('#todos-sync-btn').click(function(){
    syncTodos();
});

$('#insert-todo-form').submit(function(event){
    event.preventDefault();
    var action = $('#action').val(),
        dueDate = new Date($('#date').val()).toISOString(),
        completed = $('#completed').is(':checked');

    var dataStore = Kinvey.DataStore.getInstance('Todo', Kinvey.DataStoreType.Sync);
    var promise = dataStore.save({
        action  : action,
        duedate : dueDate,
        completed: completed
    });
    promise.then(function (model) {
        alert("Added todo with success");
        $('#insert-todo-form').each(function () {
            this.reset();
        });
    }).catch(function (err) {
        console.log("error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
});

$('#todos-list').on('click', 'li', function () {
    var id = $(this).data("id"),
        action = $(this).data("action"),
        popupEdit = $('#popup-edit');
    console.log("action data " + id + "  " + action);
    popupEdit.data('id', id);
    popupEdit.data('action', action);
    popupEdit.popup("open");
});

$("#popup-edit").bind({
    popupafteropen: function () {
        var action = $('#popup-edit').data('action');
        $("#action-input").val(action);
    }
});

$("#popup-edit").submit(function (event) {
    event.preventDefault();
    var id = $('#popup-edit').data('id'),
        action = $("#action-input").val(),
        todo = $.grep(todos, function (e) {
            return e._id == id;
        })[0];

    todo.action = action;
    var dataStore = Kinvey.DataStore.getInstance('Todo', Kinvey.DataStoreType.Sync),
        promise = dataStore.save(todo);
    promise.then(function () {
        var listItem = $("li[data-id='" + id + "']");
        listItem.data("action", action);
        listItem.find('h3').text(action);
        $("#popup-edit").popup("close");
    }).catch(function (err) {
        console.log("error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
});

$("#cancel-form").on('click',function(){
    $( "#popup-edit" ).popup("close");
    event.preventDefault();
});

function loadTodos(){
    var dataStore = Kinvey.DataStore.getInstance('Todo', Kinvey.DataStoreType.Sync);
    var promise = dataStore.find();
    promise.then(fetchSuccessCallback).catch(fetchErrorCallback);
}

function refreshTodos() {
    var dataStore = Kinvey.DataStore.getInstance('Todo', Kinvey.DataStoreType.Sync);
    var promise = dataStore.pull();
    promise.then(fetchSuccessCallback).catch(fetchErrorCallback);
}

function syncTodos(){
    var dataStore = Kinvey.DataStore.getInstance('Todo', Kinvey.DataStoreType.Sync);
    var promise = dataStore.push();
    promise.then(function (result) {
        alert('Sync successfully ' + result.success.length + ' entities and failed to sync ' + result.error.length);
        if(result.error.length != 0){
            console.log("sync error " + JSON.stringify(result.error));
            var fails = [];
            result.error.forEach(function(error){
                fails.push({
                    entityId: error._id,
                    errorDescription: error.error.description
                })
            });
            alert("Fail reasons: " + JSON.stringify(fails));
        }
    });
}

function deleteTodoHandler(e) {
    e.stopPropagation();
    var parent = $(this).parent("li"),
        id = parent.data("id");

    var dataStore = Kinvey.DataStore.getInstance('Todo',Kinvey.DataStoreType.Sync);
    var promise = dataStore.removeById(id);
    promise.then(function () {
        console.log("delete with success");
        parent.remove();
    }).catch(function (err) {
        console.log("delete with error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
}

function fetchSuccessCallback(entities) {
    todos = entities;
    var todosList = $('#todos-list');
    todosList.empty();
    $.each(entities, function (i, row) {
        todosList.append('<li data-id="' + row._id + '" data-action="' + row.action + '"><a>' + '<h3>' + row.action + '</h3> ' + '<p>' + row.duedate + '  ' + row.completed + '</p>' + '<a class="delete-todo"></li>');
    });
    $(".delete-todo").click(deleteTodoHandler);
    todosList.listview('refresh');
}

function fetchErrorCallback(err){
    alert("Error: " + err.description);
    console.log("fetch partners error " + JSON.stringify(err));
}