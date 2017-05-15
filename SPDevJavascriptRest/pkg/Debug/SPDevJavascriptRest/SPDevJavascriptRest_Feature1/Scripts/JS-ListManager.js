"user strict"

var SPDevJS = window.SPDevJS || {};
SPDevJS.Utilities = SPDevJS.Utilities || {};

SPDevJS.Utilities.ListManager = function () {
    function _getAllLists() {
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var lists = context.get_web().get_lists();
        context.load(lists, 'Include(Title,Id)');
        context.executeQueryAsync(_onSucceed, _onFail);
        function _onSucceed() {
            var listEnumerator = lists.getEnumerator();
            var msg = "Lists : <ul>";
            while (listEnumerator.moveNext()) {
                var oList = listEnumerator.get_current();
                msg += "<li>" + oList.get_title() + "</li>";
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

    function _getList(listName) {
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listName);
        context.load(oList);
        context.executeQueryAsync(
            function () {
                dfd.resolve(oList);
            },
            function () {
                dfd.reject(sender, args);
            }
        );
        return dfd.promise();
    }


    function _getItemCount(callBack,listName) {
        _getList(listName)
            .then(
                function (targetList) {
                    callBack(listName, targetList.get_itemCount());
                },
                function (sender, args) {
                    SPDevJS.CURD.LogResult(sender, args, "Error while fetching list");
                }
            );
    }

    function _getOrCreateList(listName, listDesc, listTempalte) {
        var dfd = $.Deferred();
        //Set default value if not provided
        listDesc = listDesc ? listDesc : "Created by JSOM";
        listTempalte = listTempalte ? listTempalte : SP.ListTemplateType.genericList;

        var context = SP.ClientContext.get_current();
        //Get Exception scope object and run it through try/catch/finally block
        var errScope = new SP.ExceptionHandlingScope(context);
        var scopeStart = errScope.startScope();
            
        var tryBlock = errScope.startTry();
            var listInfo = new SP.ListCreationInformation();
            listInfo.set_title(listName);
            listInfo.set_description(listDesc);
            listInfo.set_templateType(listTempalte);
            oList = context.get_web().get_lists().add(listInfo);
            oList.get_fields().addFieldAsXml('<Field DisplayName="TestField" Type="Text" Required="FALSE" Name="TestField" />', true, SP.AddFieldOptions.defaultValue);
        tryBlock.dispose();

        var catchBlock = errScope.startCatch();
            var oList = context.get_web().get_lists().getByTitle(listName);
        catchBlock.dispose();
        
        var finallyBlock = errScope.startFinally();
            context.load(oList);
        finallyBlock.dispose();
        scopeStart.dispose();

        context.executeQueryAsync(_onSucceed, _onFail);
        function _onSucceed() {
            var msg;
            if (errScope.get_hasException()) {
                //msg = "List Created on Server : " + oList.get_title();
                msg = oList.get_title() + " : List already present on site";
            }
            else {                
                //msg = oList.get_title() + " : List already present on site";
                msg = "List Created on Server : " + oList.get_title();
            }
            dfd.resolve(msg);
        }
        function _onFail(sender, args) {
            alert("Call Failed, Error" + args.get_message())
            dfd.reject(sender, args);
        }
        return dfd.promise();
    }

    function _deleteList(listName){
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listName);
        oList.deleteObject();
        context.executeQueryAsync(
            function () {
                dfd.resolve("List Deleted");
            },
            function (sender,args) {
                dfd.reject(sender, args);
            }
        );
        return dfd.promise();
    }
    function _createListField(listName, fldName, fldInternalName) {
        var fldScema = '<Field DisplayName="' + fldName + '" Type="Text" Required="FALSE" Name="' + fldInternalName + '" />';
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listName);
        oList.get_fields().addFieldAsXml(fldScema, true, SP.AddFieldOptions.defaultValue);
        context.executeQueryAsync(
            function () {
                dfd.resolve("New Column " +  fldName + " Added to List " + listName);
            },
            function (sender, args) {
                dfd.reject(sender, args);
            }
        );
        return dfd.promise();
    }
    function _getListFields(listName) {
        var dfd = $.Deferred();
        var context = SP.ClientContext.get_current();
        var oList = context.get_web().get_lists().getByTitle(listName);
        var fields = oList.get_fields()
        context.load(fields, 'Include(Title,FieldTypeKind)');
        context.executeQueryAsync(_onSucceed, _onFail);
        function _onSucceed() {
            var fldEnumerator = fields.getEnumerator();
            var msg = "Lists : <ul>";
            while (fldEnumerator.moveNext()) {
                var oField = fldEnumerator.get_current();
                msg += "<li>" + oField.get_title() + " : " + oField.get_fieldTypeKind() + "</li>";
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
    var publicMembers = {
        getAllLists: _getAllLists,
        getList: _getList,
        getOrCreateList: _getOrCreateList,
        getCount: _getItemCount,
        deleteList: _deleteList,
        createListField: _createListField,
        getListFields : _getListFields
    };
    return publicMembers;
};