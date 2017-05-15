<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ID="Content1" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../SiteAssets/Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.debug.js"></script> 
    <script type="text/javascript" src="/_layouts/15/sp.debug.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.init.js"></script>
    <script type="text/javascript" src="/_layouts/15/init.js"></script>

    <script type="text/javascript" src="../SiteAssets/Scripts/JS-CURD.js"></script>
    <script type="text/javascript" src="../SiteAssets/Scripts/JS-ListManager.js"></script>
    <script type="text/javascript" src="../SiteAssets/Scripts/JS-ListItemManager.js"></script>
    <link rel="Stylesheet" type="text/css" href="../Style Library/SPJsDev/App.css" />
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ID="Content2" ContentPlaceHolderID="PlaceHolderMain" runat="server">

  <div class="basicJSRESTContainer">
        
       
          <input type="button" id="btnRdLsts" Value="Read Lists" />
          <input type="button" id="btnRdLstItms" Value="Read List Items" />
          <input type="button" id="btnRdLstFld" Value="Read List Fields" />
      <br /><br />    
          <input type="button" id="btnCrtLst" Value="Create List" />
          <input type="button" id="btnCrtLstItm" Value="Create List Item" />
          <input type="button" id="btnCrtLstFld" Value="Create List Field" />
      <br /><br />    
          <input type="button" id="btnUpdLsttm" Value="Update List Item" />
          <input type="button" id="btnDelLsttm" Value="Delete List Item" />
          <input type="button" id="btnDelLst" Value="Delete List" />
      <%--
      <br /><br />    
          <input type="button" id="crudButton8" Value="Create Item in New List" />
          <input type="button" id="crudButton9" Value="Add Text Field" /> --%>
      <br />
      <br />
       <div class="resultsDisplayHeaderSingle">
            Results
       </div>
       <div id="results" class="resultsDisplaySingle" >
           TestContent
           <br />
           Test New Line
       </div>
          

          
         
    </div>
    

</asp:Content>
