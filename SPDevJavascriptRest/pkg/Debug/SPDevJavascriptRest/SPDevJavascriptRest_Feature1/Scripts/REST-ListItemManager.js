"user strict"

var SPDevRest = window.SPDevRest || {};
SPDevRest.Utilities = SPDevRest.Utilities || {};

SPDevRest.Utilities.ListItemManager = function () {
    var pageNum = 0;
    var pageSize = 5;
    function _getItem(listName, itemId) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/");
        baseUrl += "GetByTitle('" + listName + "')/items(" + itemId + ")";
        //alert(baseUrl);
        var dfd = $.ajax({
            url: encodeURI(baseUrl),
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return dfd.promise();
    }

    function _getItems(listName) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/"); 
        baseUrl += "GetByTitle('" + listName + "')/items";
        //alert(baseUrl);
        var dfd = $.ajax({
            url: encodeURI(baseUrl),
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return dfd.promise();
    }

    function _getItemsPaged(listName) {
        
        var oldValue = pageNum;
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/");
        baseUrl += "GetByTitle('" + listName + "')/items/?$top=" + pageSize;

        //skip Token for paging
        baseUrl = encodeURI(baseUrl) + "&$skiptoken=Paged%3dTRUE%26p_ID%3d" + pageNum * pageSize;
        ++pageNum;
        SPDevRest.CURD.LogResult(baseUrl)
        //alert(oldValue + " : " + pageNum);
        //alert(baseUrl);
        var dfd = $.ajax({
            url: baseUrl, /* No need encode as already encoded*/
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return dfd.promise();
    }

    function _getItemsFilteredByLookUp(listName) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/");
        baseUrl += "GetByTitle('" + listName + "')/items";
        baseUrl += "?$select=Title,Category/Title&$expand=Category/Title&$filter=(Category/Title eq 'Beverages')";
        //?$select=Title,Category/Title&$expand=Category/Title&$filter=(Category/Title eq 'Beverages')
        //alert(baseUrl);
        var dfd = $.ajax({
            url: encodeURI(baseUrl),
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return dfd.promise();
    }

    function _addListItem(listName, listItemValues) {
        
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists");
        baseUrl += "/GetByTitle('"+listName + "')/items"
        var itemData = JSON.stringify(listItemValues);
        var headers = {
            "accept": "application/json;odata=verbose",
            "content-length": itemData.length,
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        };
        //alert(encodeURI(baseUrl));
        //alert(itemData);
        var d = $.ajax({
            url: encodeURI(baseUrl),
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: itemData,
            headers: headers
        });
        
        return d.promise();
    }

    function _updateListItem(listName, itemId, etag, itemValues) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists");
        baseUrl += "/GetByTitle('" + listName + "')/items(" + itemId + ")";
        var itemData = JSON.stringify(itemValues);
        var headers = {
            'X-HTTP-Method': 'PATCH',
            "content-length": itemData.length,
            'If-Match': '*',
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        };
        //alert(encodeURI(baseUrl));
        //alert(itemData);
        var d = $.ajax({
            url: encodeURI(baseUrl),
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: itemData,
            headers: headers
        });

        return d.promise();
    }
    function _deleteItem(listName, itemId) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/");
        baseUrl += "GetByTitle('" + listName + "')/items(" + itemId + ")";
        //alert(baseUrl);
        var dfd = $.ajax({
            url: encodeURI(baseUrl),
            type: "POST",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose",
                'X-HTTP-Method': 'DELETE',
                'If-Match': '*',
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            }
        });
        return dfd.promise();
    }
    
    var publicMembers = {
        getItems: _getItems,
        getItemsPaged: _getItemsPaged,
        getItemsFilteredByLookUp : _getItemsFilteredByLookUp,
        addItem: _addListItem,
        deleteItem: _deleteItem,
        getItem: _getItem,
        updateListItem: _updateListItem
    };
    return publicMembers;
};