"use strict"

var SPDevJS = window.SPDevJS || {};
SPDevJS.CURD = SPDevJS.CURD || {};

$(document).ready(function () {
    SPDevJS.CURD.BaseObj = new SPDevJS.CURD.Base();
    SPDevJS.CURD.init();
});

SPDevJS.CURD.init = function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        $("#btnRdLsts").click(SPDevJS.CURD.BaseObj.readLists);
        $("#btnRdLstItms").click(SPDevJS.CURD.BaseObj.readListItems);
        $("#btnCrtLst").click(SPDevJS.CURD.BaseObj.createList);
        $("#btnCrtLstItm").click(SPDevJS.CURD.BaseObj.createListItem);
        $("#btnDelLst").click(SPDevJS.CURD.BaseObj.removeList);
        $("#btnDelLsttm").click(SPDevJS.CURD.BaseObj.removeItem);
        $("#btnCrtLstFld").click(SPDevJS.CURD.BaseObj.addListField);
        $("#btnRdLstFld").click(SPDevJS.CURD.BaseObj.readFields);
    });
};

SPDevJS.CURD.Base = function () {
    var _lm = new SPDevJS.Utilities.ListManager();
    
    var itemValues = {
        Title: "MyItem1",
        TestField : "TestValue"
    };

    function _readLists() {
        //alert("Button Clicked");
        _lm.getAllLists()
           .then(
               function (msg) {
                   SPDevJS.CURD.LogResult(msg);
               },
               function (sender, args) {
                   SPDevJS.CURD.LogResult(sender, args, "Error while fetching lists")
               }
           );
    }

    function _createList() {
        _lm.getOrCreateList("MyCustomList", "Custom List Create by JSOM", SP.ListTemplateType.genericList)
           .then(
               function (msg) {
                   SPDevJS.CURD.LogResult(msg);
                   _readLists();
               },
               function (sender, args) {
                   SPDevJS.CURD.LogResult(sender, args, "Error while fetching list ")
               }
           );
    }

    function _removeList(){
        $.when(_lm.deleteList("MyCustomList"))
            .done(function(msg){
                SPDevJS.CURD.LogResult(msg);
                _readLists();
            })
            .fail(function(sender,args){
                SPDevJS.CURD.LogResult(sender, args, "Error while deleting list")
            })
    }

    function _readListItems() {
        var _lim = new SPDevJS.Utilities.ListItemManager("MyCustomList");
        _lim.getItems()
            .then(
                function (msg) {
                    SPDevJS.CURD.LogResult(msg)
                },
                function (sender, args) {
                    SPDevJS.CURD.LogResult(sender, args, "Error while fetching list items");
                }
            );
    }

    function _logItemsCount(targetListName, itemCount) {
        SPDevJS.CURD.LogResult(targetListName + " List has " + itemCount + " items");
    }
    function _createListItem() {
        var listName = "MyCustomList";
        _lm.getOrCreateList(listName)
            .then(
                function (listMsg) {
                    var _lim = new SPDevJS.Utilities.ListItemManager(listName);
                    _lim.addItem(itemValues)
                        .then(
                            function (msg) {
                                _lm.getCount(_logItemsCount, listName);
                            },
                            function (sender, args) {
                                SPDevJS.CURD.LogResult(sender, args, "Error while creating listiem")
                            }
                        );
                },
                function (sender, args) {
                    SPDevJS.CURD.LogResult(sender, args, "Error while fetching lists");
                }                
            );
    }

    function _removeListItem() {
        var listName = "MyCustomList";
        var id = prompt("Enter the ID of the item to delete", "1");
        if (isNaN(id)) {
            alert("Please enter a number");
        }
        else {
            var _lim = new SPDevJS.Utilities.ListItemManager(listName);
            _lim.deleteItem(id)
                .then(
                    function (msg) {
                        _lm.getCount(_logItemsCount, listName);
                    },
                    function (sender, args) {
                        SPDevJS.CURD.LogResult(sender, args, "Error while deleting listiem")
                    }
                );
        }
        
    }
    function _clearResults() {
        $("#results").text("");
    }

    function _addListField() {
        var listName = "MyCustomList";
        var fldName = prompt("Enter the Field Name", "TestField");
        if (fldName) {
            var fldIntName = fldName.replace(/ +/g, "");
            _lm.createListField(listName, fldName, fldIntName)
                .then(
                    function (msg) {
                        SPDevJS.CURD.LogResult(msg);
                    },
                    function (sender, args) {
                        SPDevJS.CURD.LogResult(sender, args, "Error while creating field")
                    }
                );
        }
        else {
            alert("Please enter Field Name");
        }
    }

    function _readFields() {
        var listName = "MyCustomList";
        _lm.getListFields(listName)
            .then(
                function (msg) {
                    SPDevJS.CURD.LogResult(msg);
                },
                function (sender, args) {
                    SPDevJS.CURD.LogResult(sender, args, "Error while creating field")
                }
            );
    }
    var publicMembers = {
        readLists: function () { _clearResults(); _readLists() },
        readListItems: function () { _clearResults(); _readListItems() },
        createList: function () { _clearResults(); _createList() },
        createListItem: function () { _clearResults(); _createListItem() },
        removeList: function () { _clearResults(); _removeList() },
        removeItem: function () { _clearResults(); _removeListItem() },
        addListField: function () { _clearResults(); _addListField() },
        readFields: function () { _clearResults(); _readFields()}
    };
    return publicMembers;
};


SPDevJS.CURD.LogResult = function (msg) {
    msg = GetUniqueNumber() + "- " + msg;
    $(".resultsDisplaySingle p").removeClass("highlighted");
    $(".resultsDisplay p").removeClass("highlighted");
    $("#results").append("<p class='highlighted'>" + msg + "</p>");
    $("#results").append("<hr>");
}
SPDevJS.CURD.Fail = function (sender, args, msg) {
    SPDevJS.CURD.LogResult("Error occurred on server - in Failure callback");
    msg = msg ? msg : "Error";
    SPDevJS.CURD.LogResult(msg + ": " + args.get_message());
}