/// <reference path="../../Scripts/jquery-1.4.1.min.js" />

var PublisherArray = [];

function PageLoad() {
    InitCmsMenu("m_Publisher");
    loadPublisherList();
    $("#cms_toolbar #btnAdd").click(function () {
        editPublisher();
    });
}

function loadPublisherList() {
    var $contentbox = $(".cms_contentbox");
    $contentbox.showLoading();
    $excuteWS("~CmsWS.getPublisherList", { userExtend: SimpleUser }, bindPublisherList, null, { contentbox: $contentbox });
}

function bindPublisherList(result, context) {
    var $contentbox = context.contentbox;
    var $dataTable = $contentbox.find(".cms_datatable");

    $contentbox.hideLoading();
    $dataTable.find("tr:gt(0)").remove();
    if (!result || result.length == 0) {
        $dataTable.append("<tr class='nodata lightblue'><td colspan='6'>无记录</td></tr>");
        return;
    } else {
        PublisherArray = result;
    }

    var sBuilder = [];
    var rowClass = "";
    var phone = "";
    var contact = "";
    var address1 = "";
    var address2 = "";
    $.each(result, function (i) {
        phone = (this.phone) ? this.phone : "";
        contact = (this.contact) ? this.contact : "";
        address1 = (this.address1) ? this.address1 : "";
        address2 = (this.address2) ? this.address2 : "";

        if (i % 2 == 0) {
            rowClass = "class='lightblue'";
        } else {
            rowClass = "";
        }

        sBuilder = [];
        sBuilder.push("<tr id='" + this.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + this.name + "</td>");
        sBuilder.push("<td>" + phone + "</td>");
        sBuilder.push("<td>" + contact + "</td>");
        sBuilder.push("<td>" + address1 + "</td>");
        sBuilder.push("<td>" + address2 + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editPublisher('" + this.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deletePublisher('" + this.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
    });

    $dataTable.find("tr:gt(0)").hover(function () {
        $(this).addClass("hover");
    }, function () {
        $(this).removeClass("hover");
    });
}

function initPublisherBox() {
    var sBuilder = new Array();
    sBuilder.push("<div id='cms_dialog_publisher' class='cms_dialog'>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'><span style='color:#e62701; font-size:13px;'>*</span>&nbsp;出版社名称：</li>");
    sBuilder.push("    <li class='inp'><input id='txtName' name='txtName' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>电话：</li>");
    sBuilder.push("    <li class='inp'><input id='txtPhone' name='txtPhone' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>联系人：</li>");
    sBuilder.push("    <li class='inp'><input id='txtContact' name='txtContact' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>邮编：</li>");
    sBuilder.push("    <li class='inp'><input id='txtZipCode' name='txtZipCode' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>地址一：</li>");
    sBuilder.push("    <li class='inp'><input id='txtAddress1' name='txtAddress1' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>地址二：</li>");
    sBuilder.push("    <li class='inp'><input id='txtAddress2' name='txtAddress2' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>国家：</li>");
    sBuilder.push("    <li class='inp'><input id='txtCountry' name='txtCountry' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>省：</li>");
    sBuilder.push("    <li class='inp'><input id='txtState' name='txtState' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("<ul>");
    sBuilder.push("    <li class='fname'>市：</li>");
    sBuilder.push("    <li class='inp'><input id='txtCity' name='txtCity' type='text' style='width:100%;' /></li>");
    sBuilder.push("</ul>");
    sBuilder.push("</div>");
    return sBuilder.join("");
}

function editPublisher(id) {
    var title = "";
    var _id = "";
    if (id) {
        title = "编辑出版社";
        _id = id;
    } else {
        title = "添加出版社";
        _id = "";
    }

    var $jb = $.jBox(initPublisherBox(), { id: 'jb_cmsPublisher', title: title, width: 580, top: "25%", buttons: { "保存": true, "取消": false }, submit: submitPublisher });
    var $publisher = $jb.find("#cms_dialog_publisher");
    $publisher.data("_id", _id);

    if (id) {
        var publisher = getPublisherObj(id);
        $publisher.find("#txtName").val(publisher.name);
        $publisher.find("#txtPhone").val(publisher.phone);
        $publisher.find("#txtContact").val(publisher.contact);
        $publisher.find("#txtZipCode").val(publisher.zipCode);
        $publisher.find("#txtAddress1").val(publisher.address1);
        $publisher.find("#txtAddress2").val(publisher.address2);
        $publisher.find("#txtCountry").val(publisher.country);
        $publisher.find("#txtState").val(publisher.state);
        $publisher.find("#txtCity").val(publisher.city);
    }
}

function deletePublisher(id) {
    var publisher = getPublisherObj(id);
    $.jBox.confirm("你确定要删除出版社“" + publisher.name + "”吗?", "提示", function (v, h, f) {
        if (v == true) {
            $excuteWS("~CmsWS.deletePublisher", { publisherW: { id: id }, userExtend: SimpleUser }, function (result) {
                if (result) {
                    loadPublisherList();
                } else {
                    $.jBox.tip("删除失败！", 'error');
                }
            }, null, null);
        }
    }, { top: "25%", buttons: { "确定": true, "取消": false} });
}

function getPublisherObj(id) {
    var publisher = null;
    for (var i = 0; i < PublisherArray.length; i++) {
        if (PublisherArray[i].id == id) {
            publisher = PublisherArray[i];
            break;
        }
    }
    return publisher;
}

function submitPublisher(v, h, f) {
    if (v == true) {
        var validData = validateForm(f);
        if (validData.isValid == false) {
            $.jBox.tip(validData.msg, 'warning');
            return false;
        }
        var publisherWrapper = getPublisher(f);
        var publisherId = h.find("#cms_dialog_publisher").data("_id");
        if (publisherId != "") {
            publisherWrapper.id = publisherId;
            $excuteWS("~CmsWS.editPublisher", { publisherW: publisherWrapper, userExtend: SimpleUser }, onEditPublisher, null, null);
        } else {
            $excuteWS("~CmsWS.savePublisher", { publisherW: publisherWrapper, userExtend: SimpleUser }, onSavePublisher, null, null);
        }
        return false;
    }
}

function validateForm(f) {
    var validData = { isValid: true, msg: "" };
    if (f.txtName.trim() == "") {
        validData.isValid = false;
        validData.msg = "出版社名称不能为空！";
    }
    return validData;
}

function getPublisher(f) {
    var publisher = {};
    publisher.name = f.txtName.trim();
    publisher.phone = f.txtPhone.trim();
    publisher.contact = f.txtContact.trim();
    publisher.zipCode = f.txtZipCode.trim();
    publisher.address1 = f.txtAddress1.trim();
    publisher.address2 = f.txtAddress2.trim();
    publisher.country = f.txtCountry.trim();
    publisher.state = f.txtState.trim();
    publisher.city = f.txtCity.trim();
    return publisher;
}

function onSavePublisher(result) {
    var publisher = result;
    if (!publisher) {
        $.jBox.tip("保存失败！", 'error');
    } else {
        $.jBox.close('jb_cmsPublisher');
        PublisherArray.push(publisher);

        var $dataTable = $(".cms_contentbox .cms_datatable");
        var rowCount = $dataTable.find("tr:gt(0)").length;
        if (rowCount == 1) {
            var $fRow = $dataTable.find("tr:eq(1)");
            if ($fRow.hasClass("nodata")) {
                $fRow.remove();
                rowCount--;
            }
        }
        rowCount++;
        var rowClass = "";
        if (rowCount % 2 != 0) {
            rowClass = "class='lightblue'";
        }

        sBuilder = new Array();
        sBuilder.push("<tr id='" + publisher.id + "' " + rowClass + ">");
        sBuilder.push("<td>" + publisher.name + "</td>");
        sBuilder.push("<td>" + publisher.phone + "</td>");
        sBuilder.push("<td>" + publisher.contact + "</td>");
        sBuilder.push("<td>" + publisher.address1 + "</td>");
        sBuilder.push("<td>" + publisher.address2 + "</td>");
        sBuilder.push("<td class='operate'><img src='Images/application_edit.png' title='编辑' onclick=\"editPublisher('" + publisher.id + "')\" />&nbsp;<img src='Images/application_delete.png' title='删除' onclick=\"deletePublisher('" + publisher.id + "')\" /></td>");
        sBuilder.push("</tr>");
        $dataTable.append(sBuilder.join(''));
        $dataTable.find("tr:last").hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
    }
}

function onEditPublisher(result) {
    var publisher = result;
    if (!publisher) {
        $.jBox.tip("更新失败！", 'error');
    } else {
        $.jBox.close('jb_cmsPublisher');
        loadPublisherList();
    }
}