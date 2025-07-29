<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,
Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral,
PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="SharePoint"
Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint,
Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@
Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities"
Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral,
PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages"
Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint,
Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming
  ID="AllowFraming"
  runat="server"
  __WebPartId="{FD79B874-7DF6-434B-B1C9-6DFECBDF0E97}"
/>
<SharePoint:SharePointForm runat="server"> </SharePoint:SharePointForm>
<html>
  <!--[if gte mso 9
    ]><SharePoint:CTFieldRefs
      runat="server"
      Prefix="mso:"
      FieldList="FileLeafRef"
    >
      <xml>
        <mso:CustomDocumentProperties>
          <mso:Order msdt:dt="string">1100.00000000000</mso:Order>
          <mso:FSObjType msdt:dt="string">0</mso:FSObjType>
          <mso:FileDirRef msdt:dt="string"
            >/sites/Desarrollo2/EFE/App</mso:FileDirRef
          >
          <mso:ContentTypeId msdt:dt="string"
            >0x0101005CA03F08D642A1428CCFF2516A2631C7</mso:ContentTypeId
          >
          <mso:FileLeafRef msdt:dt="string">index.aspx</mso:FileLeafRef>
          <mso:ContentType msdt:dt="string">Documento</mso:ContentType>
        </mso:CustomDocumentProperties>
      </xml></SharePoint:CTFieldRefs
    ><!
  [endif]-->

  <head>
    <meta name="WebPartPageExpansion" content="full" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,shrink-to-fit=no"
    />
    <meta name="ProgId" content="SharePoint.WebPartPage.Document" />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
    <script src="dist/[PRD]2bdaecc77d010052d616.js"></script>
  </body>
</html>
