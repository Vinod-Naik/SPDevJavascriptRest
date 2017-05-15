"use strict"

var SPDevRest = window.SPDevRest || {};
SPDevRest.Utilities = SPDevRest.Utilities || {};

SPDevRest.Utilities.ListManager = function () {
    function _getAllLists() {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists");
        var d = $.ajax({
            url: baseUrl,
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return d.promise();
    }
    function _getList(listName) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/GetByTitle('" + listName + "')");
        var d = $.ajax({
            url: baseUrl,
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return d.promise();
    }
    function _getListAndFields(listName) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl,
            "_api/web/lists");
        if (listName)
            baseUrl += "/GetByTitle('" + listName + "')"
        baseUrl += "?$expand=fields/Title"
        //filter=(Category/Title eq 'Beverages')"
        //alert(encodeURI(baseUrl));
        var d = $.ajax({
            url: encodeURI(baseUrl),
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "accept": "application/json;odata=verbose"
            }
        });
        return d.promise();
    }

    function _createList(listName, description, template) {
        if (!template) {
            template = SP.ListTemplateType.genericList
        }
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists");
        
        var listProps = {
            "Title": listName,
            "Description": description,
            "BaseTemplate": template,
            "__metadata": {
                "type":"SP.List"
            }
        };
        var itemData = JSON.stringify(listProps);
        var headers = {
            "accept": "application/json;odata=verbose",
            "content-length": itemData.length,
            "X-RequestDigest":$("#__REQUESTDIGEST").val()
        };
        var d = $.ajax({
            url: baseUrl,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data:itemData,
            headers: headers
        });
        return d.promise();
    }


    function _removeList(listName, itemId) {
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists/");
        baseUrl += "GetByTitle('" + listName + "')";
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

    function _createListField(listName,fieldName,fieldType) {
        if (!fieldType) {
            fieldType = 2
        }
        var baseUrl = SP.Utilities.UrlBuilder.urlCombine(_spPageContextInfo.webServerRelativeUrl, "_api/web/lists");
        baseUrl += "/GetByTitle('" + listName + "')/fields"
        var listFieldProps = {
            '__metadata': {
                'type': 'SP.Field'
            },
            'Title': fieldName,
            'FieldTypeKind': fieldType
        };
        var fieldData = JSON.stringify(listFieldProps);
        var headers = {
            "accept": "application/json;odata=verbose",
            "content-length": fieldData.length,
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        };
        var d = $.ajax({
            url: baseUrl,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: fieldData,
            headers: headers
        });
        return d.promise();
    }
    var publicMembers = {
        getAllLists: _getAllLists,
        getList: _getList,
        getListAndFields: _getListAndFields,
        createList: _createList,
        createListField: _createListField,
        removeList: _removeList
    }
    return publicMembers;
};