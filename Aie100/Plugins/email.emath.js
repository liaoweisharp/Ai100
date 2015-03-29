//验证邮箱地址
function checkEmailFormat(txtNode) {
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(txtNode.value)) {
        txtNode.focus();
        return false;
    }
    return true;
}