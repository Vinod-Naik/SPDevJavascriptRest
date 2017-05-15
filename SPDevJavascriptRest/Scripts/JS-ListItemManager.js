"user strict"

var SPDevJS = window.SPDevJS || {};
SPDevJS.Utilities = SPDevJS.Utilities || {};

SPDevJS.Utilities.ListItemManager = function (listName) {
    function _getItems() {
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listName);
        var query = new SP.CamlQuery();
        query.set_viewXml("<View></View>")
        var listItems = oList.getItems(query);
        context.load(listItems, 'Include(Title,Id)');
        context.executeQueryAsync(_onSucceed, _onFail);
        function _onSucceed() {
            var listItemEnumerator = listItems.getEnumerator();
            var msg = "Lists items in " + listName + " : <ul>";
            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                msg += "<li>" + oListItem.get_id() + " : " + oListItem.get_item('Title')+ "</li>";
            }
            msg += "</ul>";
            dfd.resolve(msg);
        }
        function _onFail(sender, args) {
            alert("Call Failed, Error" + args.get_message())
            dfd.reject(sender, args);
        }
        return dfd.promise();
    }

    function _addListItem(listItemValues) {
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listName);
        
        var itemInfo = new SP.ListItemCreationInformation();
        var oListItem = oList.addItem(itemInfo)
        
        for (fldName in listItemValues) {
            oListItem.set_item(fldName, listItemValues[fldName]);
        }
        oListItem.update();
        context.load(oListItem);
        context.executeQueryAsync(_onSucceed, _onFail);

        function _onSucceed() {
            var msg = "New List Item Created " + oListItem.get_item('Title');
            dfd.resolve(msg);
        }
        function _onFail(sender, args) {
            //alert("Call Failed, Error" + args.get_message())
            dfd.reject(sender, args);
        }
        return dfd.promise();
    }

    function _deleteListItem(itemId) {
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oListItem = context.get_web().get_lists().getByTitle(listName).getItemById(itemId);
        oListItem.deleteObject()
        context.executeQueryAsync(
                function () {
                    var msg = "List Item Deleted ";
                    dfd.resolve(msg);
                },
                function (sender, args) {
                    dfd.reject(sender, args);
                }
            );
        return dfd.promise();
    }
    var publicMembers = {
        getItems: _getItems,
        addItem: _addListItem,
        deleteItem : _deleteListItem
    };
    return publicMembers;
};