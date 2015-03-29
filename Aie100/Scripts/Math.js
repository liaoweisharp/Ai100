//解决小数相加出现的误差
function add(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //return (arg1 * m + arg2 * m) / m;
    return accDiv(accMul(arg1, m) + accMul(arg2, m), m);
}
//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
}

//保留x位小数（四舍五入）
function Math_Round(num, x) {

    if (!isNaN(num) && !isNaN(x)) {
        return parseFloat(num).toFixed(x);
    }
    return 0;
}

//保留x位小数（不四舍五入）
function decimalPlaces(num, x) {
    var power = Math.pow(10, x);
    var d = (Math.floor(num * power) / power).toFixed(x);
    return parseFloat(d);
}

//判断能否除尽
function testDivisible(m, n) {
    //将mn转整，去掉小数点；
    m = parseInt(m.toString().replace(".", ""));
    n = parseInt(n.toString().replace(".", ""));
    //舍去2和5这两个约数，因为只有1/2和1/5可以除尽；
    while (m % 2 == 0 && m != 0) m = m / 2;
    while (m % 5 == 0 && m != 0) m = m / 5;
    while (n % 2 == 0 && n != 0) n = n / 2;
    while (n % 5 == 0 && n != 0) n = n / 5;
    //判断：
    if (n == 0) return false;
    if (n == 1 || m == 0) return true;
    return m % n == 0;
}