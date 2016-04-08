var employees = [];

$('#employee-find-btn').click(function () {
    loadEmployees();
});

$('#employee-sync-btn').click(function () {
    syncEmployees();
});

$('#employee-pull-btn').click(function () {
    pullEmployees();
});

$('#employee-push-btn').click(function () {
    pushEmployees();
});

$('#employee-add-btn').click(function () {
    $('#popup-add-employee').popup("open");
});

$('#popup-add-employee').submit(function (event) {
    event.preventDefault();
    var name = $('#employee-name-add-input').val();
    var dataStore = Kinvey.DataStore.getInstance('Employees', Kinvey.DataStoreType.Cache);
    var promise = dataStore.save({
        name: name
    });
    promise.then(function (model) {

        $('#employee-name-add-input').val("");

        var employeesList = $('#employee-list');
        employeesList.append('<li data-id="' + model._id + '" data-name="' + model.name + '"><a>' + '<h3>' + model.name + '</h3> ' + '</li>');
        employeesList.listview('refresh');
        $("#popup-add-employee").popup("close");
    }).catch(function (err) {
        console.log("errorcreate " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
});


$(".form-cancel-btn").on('click', function () {
    $(".popup-edit-form").popup("close");
    event.preventDefault();
});

function loadEmployees() {
    var dataStore = Kinvey.DataStore.getInstance('Employees', Kinvey.DataStoreType.Cache);
    dataStore.find().then(function (result) {
        // The entities fetched from the cache
        var cache = result.cache;
        // Return the promise for fetching the entities from the backend
        return result.networkPromise;
    }).then(fetchSuccessEmployeesCallback).catch(fetchErrorEmployeesCallback);
}

function pullEmployees() {
    var dataStore = Kinvey.DataStore.getInstance('Employees', Kinvey.DataStoreType.Cache);
    var promise = dataStore.pull();
    promise.then(function(){
    }).catch(fetchErrorEmployeesCallback);
}

function syncEmployees(){
    var dataStore = Kinvey.DataStore.getInstance('Employees', Kinvey.DataStoreType.Cache);
    var promise = dataStore.sync();
    promise.then(function (result) {
        result = result.push;
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

function pushEmployees(){
    var dataStore = Kinvey.DataStore.getInstance('Employees', Kinvey.DataStoreType.Cache);
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


function fetchSuccessEmployeesCallback(entities) {
    employees = entities;
    var employeesList = $('#employee-list');
    employeesList.empty();
    $.each(entities, function (i, row) {
        employeesList.append('<li data-id="' + row._id + '" data-name="' + row.name + '"><a>' + '<h3>' + row.name + '</h3> ' + '</li>');
    });
    employeesList.listview('refresh');
}

function fetchErrorEmployeesCallback(err) {
    alert("Error: " + err.description);
    console.log("fetch employees error " + JSON.stringify(err));
}