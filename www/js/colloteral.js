$('#colloteral-load-btn').click(function(){
    loadColloteral();
});


function loadColloteral(){
    //TODO change find call
    var query = new Kinvey.Query();
    query.equalTo('mimeType','application/pdf');

    var fileStore = new Kinvey.FileStore();
    var promise = fileStore.find(query);
    promise.then(function(entities) {
        var colloteralList = $('#colloteral-list');
        colloteralList.empty();
        $.each(entities, function(i, row) {
            //colloteralList.append('<li data-id="' + row._id + '"><a href="#" onclick="window.open(/"' + row._downloadURL + '/",/"system/")">' + '<h3>' + row._filename + '</h3></li>');
            colloteralList.append('<li data-id="' + row._id + '"><a href="#" onclick="window.open(\'' + row._downloadURL +  '\', \'_system\');">' + '<h3>' + row._filename + '</h3></li>');
        });
        colloteralList.listview('refresh');
    }).catch(function(err) {
        alert("Error: " + err.description);
        console.log("fetch partners error " + JSON.stringify(err));
    });
}