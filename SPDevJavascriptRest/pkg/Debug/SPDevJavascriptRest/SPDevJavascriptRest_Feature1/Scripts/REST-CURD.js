
"use strict"

var SPDevRest = window.SPDevRest || {};
SPDevRest.CURD = SPDevRest.CURD || {};

$(document).ready(function () {
    SPDevRest.CURD.BaseObj = new SPDevRest.CURD.Base();
    SPDevRest.CURD.init();
});

SPDevRest.CURD.init = function () {
    $("#btnRdLsts").click(SPDevRest.CURD.BaseObj.readLists);
    $("#btnRdLstItms").click(SPDevRest.CURD.BaseObj.readListItems);
    $("#btnRdLstItmsPgd").click(SPDevRest.CURD.BaseObj.readListItemsPaged);
    $("#btnRdLstItmsCtgr").click(SPDevRest.CURD.BaseObj.readListItemsByCategory);
    $("#btnRdLstFlds").click(SPDevRest.CURD.BaseObj.readListFields);
    $("#btnCrtLst").click(SPDevRest.CURD.BaseObj.createList);
    $("#btnCrtLstItm").click(SPDevRest.CURD.BaseObj.createListItem);
    $("#btnCrtLstFld").click(SPDevRest.CURD.BaseObj.createListField);
    $("#btnUpdLsttm").click(SPDevRest.CURD.BaseObj.updateListItem);
    $("#btnDelLsttm").click(SPDevRest.CURD.BaseObj.deleteListItem);
    $("#btnDelLst").click(SPDevRest.CURD.BaseObj.deleteList);
}

SPDevRest.CURD.Base = function () {
    var _lm = new SPDevRest.Utilities.ListManager();
    var _queryList = "Products";
    var _parentList = "Categories";
    var _commonListName = "RestList"
    var _lim = new SPDevRest.Utilities.ListItemManager();
    function _clearResults() {
        $("#results").text("");
    }
    function _readLists() {
        var dfd = $.Deferred();
        _lm.getAllLists()
            .then(
                function (data,status,jqXHR) {
                    _readListSuccess(data);
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error)
                    dfd.reject();
                }
            );
        return dfd.promise();
    }

    function _readListSuccess(data) {
        var msg = " Lists on this site are : <ul>";
        if (data.d.results.length > 0) {
            $.each(data.d.results, function (index, value) {
                if (!value.Hidden) {
                    msg += "<li>" + value.Title + "</li>";
                }                
            });
        }
        else {
            msg += "<li>" + data.d.Title + "</li>";
        }
        SPDevRest.CURD.LogResult(msg);
    }

    function _readListItems(listName) {
        var dfd = $.Deferred();
        if(!listName){
            listName = _queryList;
        }
        _lim.getItems(listName)
            .then(
                function (data, status, jqXHR) {
                    _readListItemsSuccess(data, listName);
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }

    function _getListItem(listName) {
        var dfd = $.Deferred();
        if (!listName) {
            listName = "MyCustomList";
        }
        var itemId = prompt("Please enter ItemId you want to update", 1);
        _lim.getItem(listName,itemId)
            .then(
                function (data, status, jqXHR) {
                    _updateListItem(data);
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }
    function _fetchAndUpdateListItem() {
        var dfd = $.Deferred();
        var listName = "MyCustomList"
        _readListItems(listName);
        var itemId = prompt("Please enter ItemId you want to update", 1);
        _lim.getItem(listName, itemId)
            .then(
                function (data, status, jqXHR) {
                    var values = _getRandomListItemValues();
                    _updateListItem(data, listName, values);
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }
    function _updateListItem(data, listName,values) {
        var dfd = $.Deferred();
        if (data.d.__metadata.etag) {
            _lim.updateListItem(listName, data.d.Id, data.d.__metadata.etag, values)
                .then(
                    function (data, status, jqXHR) {
                        _updateListItemSuccess(data,listName);
                        dfd.resolve()
                    },
                    function (jqHCR, status, error) {
                        SPDevRest.CURD.LogResult(error);
                        dfd.reject();
                    }
                    );
        }
        return dfd.promise();
    }
    function _updateListItemSuccess(data, listName) {
        SPDevRest.CURD.LogResult("List Item Updated in " + listName);
        _readListItems(listName)        
    }
    function _fetchAndDeleteListItem() {
        var dfd = $.Deferred();
        var listName = "MyCustomList"
        _readListItems(listName);
        var itemId = prompt("Please enter ItemId you want to delete", 1);
        _lim.deleteItem(listName, itemId)
            .then(
                function (data, status, jqXHR) {
                    _deleteListItemSuccess(listName)
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }
    function _deleteListItemSuccess(listName) {
        SPDevRest.CURD.LogResult("List Item deleted in " + listName);
        _readListItems(listName)
    }
    function _readListItemsPaged() {
        _lim.getItemsPaged(_queryList)
            .then(
                function (data, status, jqXHR) {
                    _readListItemsSuccess(data);
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error)
                }
            );
    }
    function _readListItemsByCategory() {
        var dfd = $.Deferred();
        _lim.getItemsFilteredByLookUp(_queryList)
            .then(
                function (data, status, jqXHR) {
                    _readListItemsSuccess(data);
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd;
    }
    function _readListItemsSuccess(data,listName) {
        var msg = " Items on this List " + listName + ": <ul>";
        if (data.d.results.length) {
            if (data.d.results.length > 0) {
                $.each(data.d.results, function (index, value) {
                    msg += "<li>" + value.Title + "</li>";
                });
            }
            else {
                msg += "<li>" + data.d.Title + "</li>";
            }
        }
        else {
                msg = "No items found"
        }
        if (data.d.__next) {
            msg += "<br />Results are paged and accessible on below url: <br />";
            msg += data.d.__next;
        }
        SPDevRest.CURD.LogResult(msg);
    }

    function _readListFields(listName) {
        _lm.getListAndFields(listName)
            .then(
                function (data, status, jqXHR) {
                    _readListAndFieldSuccess(data);
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error)
                }
            );
    }

    function _readListAndFieldSuccess(data) {
        var msg=""
        if (data.d.results) {
            $.each(data.d.results, function (index, value) {
                msg += " Lists field on " + value.Title + " : <ul>";
                $.each(data.d.results[index].Fields.results, function (fieldIndex, fieldVallue) {
                    msg += "  <li>" + fieldVallue.Title + "</li>";
                });
                msg += "</ul>";
            });
        }
        else {
            msg += " Lists fields on " + data.d.Title + " : <ul>";
            $.each(data.d.Fields.results, function (fieldIndex, fieldVallue) {
                msg += "  <li>" + fieldVallue.Title + "</li>";
            });
            msg += "</ul>";
        }
        SPDevRest.CURD.LogResult(msg);
    }

    function _createList() {
        var dfd = $.Deferred();
        var listName = "RestList";
        _readLists()
            .then(
                function (data, status, jqXHR) {
                    _lm.createList(listName, "List Created By REST", null)
                        .then(
                            function (data, status, jqXR) {
                                _createListSuccess(listName);
                                dfd.resolve();
                            },
                            function (jqXHR, status, error) {
                                SPDevRest.CURD.LogResult(error);
                                dfd.reject();
                            }
                        );
                }
            );
        return dfd.promise();
    }

    function _createListSuccess(listName) {
        var dfd = $.Deferred();
        var msg = "List Created : ";
        var url = SP.Utilities.UrlBuilder.urlCombine(
            _spPageContextInfo.webServerRelativeUrl,
            "lists/");
        url = SP.Utilities.UrlBuilder.urlCombine(url, listName);
        msg += "<a href='" + url + "' target='_blank'>";
        msg += listName + "</a>";
        SPDevRest.CURD.LogResult(msg);

        _readLists()
            .then(
                function (data, status, jqXHR) {
                    dfd.resolve();
                }
            );
        return dfd.promise();
    }

    function _deleteList() {
        var dfd = $.Deferred();
        var listName = "RestList"
        _readLists();
        _lm.removeList(listName)
            .then(
                function (data, status, jqXHR) {
                    _deleteListSuccess(listName)
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }
    function _deleteListSuccess(listName) {
        SPDevRest.CURD.LogResult("List " + listName + " deleted ");
        _readLists();
    }

    function _getRandomListItemValues(){
        var rnd = Math.floor(Math.random() * 20) + 8 
        var title = "RestCategory_" + rnd;
        return{
            'Title':title,
            'TestField': "TestValue_" + rnd,
            'MyField1': "Random Item Created By REST",
            "__metadata": {
                "type": "SP.Data.MyCustomListListItem"
            }
        };
    }

    function _createListItem() {
        var dfd = $.Deferred();
        var listName = "MyCustomList";
        var listItemValues = _getRandomListItemValues();
        _lim.addItem(listName, listItemValues)
            .then(
                function (data, status, jqXHR) { 
                    _createListItemSuccess(listName);
                    dfd.resolve();
                },
                function (jqXHR, status, error) { 
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }

    function _createListItemSuccess(listName) {
        var dfd = $.Deferred();
        var msg = "List Item Created : ";
        SPDevRest.CURD.LogResult(msg);
        _readListItems(listName)
            .then(
                function (data, status, jqXHR) {
                    dfd.resolve();
                }
            );
        return dfd.promise();
    }


    function _createListField() {
        var dfd = $.Deferred();
        var listName = "RestList";
        var listItemValues = _getRandomListItemValues();
        _lm.createListField(listName, "NewColumn" , 2)
            .then(
                function (data, status, jqXHR) {
                    _createListFieldSuccess(listName);
                    dfd.resolve();
                },
                function (jqXHR, status, error) {
                    SPDevRest.CURD.LogResult(error);
                    dfd.reject();
                }
            );
        return dfd.promise();
    }

    function _createListFieldSuccess(listName) {
        var dfd = $.Deferred();
        var msg = "List Field Created : ";
        SPDevRest.CURD.LogResult(msg);
        _readListFields(listName)
            .then(
                function (data, status, jqXHR) {
                    dfd.resolve();
                }
            );
        return dfd.promise();
    }

    var publicMembers = {
        readLists: function () { _clearResults(); _readLists() },
        readListItems: function () { _clearResults(); _readListItems(null) },
        readListItemsPaged: function () { _clearResults(); _readListItemsPaged() },
        readListItemsByCategory: function () { _clearResults(); _readListItemsByCategory() },
        readListFields: function () { _clearResults(); _readListFields() },
        createList : function () { _clearResults(); _createList() },
        createListItem: function () { _clearResults(); _createListItem() },
        createListField: function () { _clearResults(); _createListField() },
        updateListItem: function () { _clearResults(); _fetchAndUpdateListItem() },
        deleteListItem: function () { _clearResults(); _fetchAndDeleteListItem() },
        deleteList: function () { _clearResults(); _deleteList() }
    }
    return publicMembers;
}

SPDevRest.CURD.LogResult = function (msg) {
    msg = GetUniqueNumber() + "- " + msg;
    $(".resultsDisplaySingle p").removeClass("highlighted");
    $(".resultsDisplay p").removeClass("highlighted");
    $("#results").append("<p class='highlighted'>" + msg + "</p>");
    $("#results").append("<hr>");
}
SPDevRest.CURD.Fail = function (err) {
    SPDevRest.CURD.LogResult("Error occurred on server - in Failure callback");
    
    SPDevRest.CURD.LogResult(err);
}