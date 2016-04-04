$('#partners-load-btn').click(function () {
    loadPartners();
});


function loadPartners() {
    var dataStore = Kinvey.DataStore.getInstance('Partner');
    dataStore.find().then(function (result) {
        var cache = result.cache;
        return result.networkPromise;
    }).then(function (entities) {
        var partnersList = $('#partners-list');
        partnersList.empty();
        $.each(entities, function (i, row) {
            partnersList.append('<li data-id="' + row._id + '"><a>' + '<h3>' + row.partnername + '</h3> ' + '<p>' + row.partnercompany + '</p>' + '</li>');
        });
        partnersList.listview('refresh');
    }).catch(function (err) {
        alert("Error: " + err.description);
        console.log("fetch partners error " + JSON.stringify(err));
    });
}