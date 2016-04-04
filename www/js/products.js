$('#products-load-btn').click(function(){
    loadProducts();
});

$('#products-sort-btn').click(function(){
    sortProducts();
});

$('#products-skip-btn').click(function(){
    skipProducts();
});

$('#products-limit-btn').click(function(){
    limitProducts();
});

function loadProducts(query) {
    var dataStore = Kinvey.DataStore.getInstance('Products');
    var promise = dataStore.find(query);
    promise.then(function (result) {
        return result.networkPromise;
    }).then(function (entities) {
        var productsList = $('#products-list');
        productsList.empty();
        $.each(entities, function (i, row) {
            productsList.append('<li data-id="' + row._id + '"><a>' + '<h3>' + row.productname + '</h3> ' + '<p>' + row.productdesc + '</p>' + '  <a class="delete-product"></a></li>');
        });
        productsList.listview('refresh');

        $(".delete-product").click(deleteProductHandler);
    }).catch(function (err) {
        console.log("fetch partners error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
}

function sortProducts(){
    var query = new Kinvey.Query();
    query.descending('productname');
    loadProducts(query);
}

function limitProducts(){
    var query = new Kinvey.Query();
    query.limit(4);
    loadProducts(query);
}

function skipProducts(){
    var query = new Kinvey.Query();
    query.skip(0);
    query.limit(1);
    loadProducts(query);
}

function deleteProductHandler() {
    var parent = $(this).parent("li"),
        id = parent.data("id");

    var dataStore = Kinvey.DataStore.getInstance('Products');
    var promise = dataStore.removeById(id);
    promise.then(function () {
        console.log("delete with success");
        parent.remove();
    }).catch(function (err) {
        console.log("delete with error " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
}