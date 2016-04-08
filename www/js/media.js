var media = [];

$('#media-reload-btn').click(function () {
    loadMedia();
});

$('#media-add-btn').click(function () {
    $('#popup-add-media').popup("open");
});

$('#popup-add-media').submit(function (event) {
    event.preventDefault();
    var name = $('#media-name-add-input').val();
    var dataStore = Kinvey.DataStore.getInstance('Media', Kinvey.DataStoreType.Network);
    var promise = dataStore.save({
        name: name
    });
    promise.then(function (model) {

        $('#media-name-add-input').val("");

        var mediaList = $('#media-list');
        mediaList.append('<li data-id="' + model._id + '" data-name="' + model.name + '"><a>' + '<h3>' + model.name + '</h3> ' + '<a class="delete-media"></li>');
        $(".delete-media").click(deleteMediaHandler);
        mediaList.listview('refresh');
        $("#popup-add-media").popup("close");
    }).catch(function (err) {
        console.log("errorcreate " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
});

$('#media-list').on('click', 'li', function () {
    console.log("li");
    var id = $(this).data("id"),
        name = $(this).data("name"),
        popupEdit = $('#popup-edit-media');
    console.log(" data " + id + "  " + name);
    popupEdit.data('id', id);
    popupEdit.data('name', name);
    popupEdit.popup("open");
});

$("#popup-edit-media").bind({
    popupafteropen: function () {
        var name = $('#popup-edit-media').data('name');
        $("#media-name-edit-input").val(name);
    }
});

$("#popup-edit-media").submit(function (event) {
    event.preventDefault();
    var id = $('#popup-edit-media').data('id'),
        name = $("#media-name-edit-input").val(),
        mediaEntity = $.grep(media, function (e) {
            return e._id == id;
        })[0];

    var dataStore = Kinvey.DataStore.getInstance('Media', Kinvey.DataStoreType.Network);
    mediaEntity.name = name;
    var promise = dataStore.save(mediaEntity);
    promise.then(function () {
        var listItem = $("li[data-id='" + id + "']");
        listItem.data("name", name);
        listItem.find('h3').text(name);
        $("#popup-edit-media").popup("close");
    }).catch(function (err) {
        console.log("error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
});

$(".form-cancel-btn").on('click', function () {
    $(".popup-edit-form").popup("close");
    event.preventDefault();
});

function loadMedia() {
    console.log("get media");
    var dataStore = Kinvey.DataStore.getInstance('Media', Kinvey.DataStoreType.Network);
    var promise = dataStore.find();
    promise.then(fetchSuccessMediaCallback).catch(fetchErrorMediaCallback);
}

function deleteMediaHandler(e) {
    e.stopPropagation();
    var parent = $(this).parent("li"),
        id = parent.data("id");
    var dataStore = Kinvey.DataStore.getInstance('Media', Kinvey.DataStoreType.Network);
    var promise = dataStore.removeById(id);
    promise.then(function () {
        console.log("delete with success");
        parent.remove();
    }).catch(function (err) {
        console.log("delete with error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
}

function fetchSuccessMediaCallback(entities) {
    media = entities;
    var mediaList = $('#media-list');
    mediaList.empty();
    $.each(entities, function (i, row) {
        mediaList.append('<li data-id="' + row._id + '" data-name="' + row.name + '"><a>' + '<h3>' + row.name + '</h3> ' + '<a class="delete-media"></li>');
    });
    $(".delete-media").click(deleteMediaHandler);
    mediaList.listview('refresh');
}

function fetchErrorMediaCallback(err) {
    alert("Error: " + err.description);
    console.log("fetch partners error " + JSON.stringify(err));
}