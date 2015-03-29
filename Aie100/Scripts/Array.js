/**
* each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
* 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
{%example
<script>
var a = [1,2,3,4].each(function(x){return x > 2 ? x : null});
var b = [1,2,3,4].each(function(x){return x < 0 ? x : null});
alert(a);
alert(b);
</script>
%}
* @param {Function} fn 进行迭代判定的函数
* @param more ... 零个或多个可选的用户自定义参数
* @returns {Array} 结果集，如果没有结果，返回空集
*/
Array.prototype.each = function (fn)
{
    fn = fn || Function.K;
    var a = [];

    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.length; i++)
    {
        var res = fn.apply(this, [this[i], i].concat(args));
        if (res != null) a.push(res);
    }
    return a;
};
/**
是否包含
*/
Array.prototype.contains = function (o)
{
    var isContain = false;
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == o)
        {
            isContain = true;
        }
    }
    return isContain;
}
/**
* 得到一个数组不重复的元素集合<br/>
* 唯一化一个数组
* @returns {Array} 由不重复元素构成的数组
*/
Array.prototype.uniquelize = function ()
{

    var ra = new Array();
    for (var i = 0; i < this.length; i++)
    {
        if (!ra.contains(this[i]))
        {
            ra.push(this[i]);
        }
    }
    return ra;
};

/**
* 求两个集合的补集
{%example
<script>
var a = [1,2,3,4];
var b = [3,4,5,6];
alert(a.complement(b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的补集
*/
Array.prototype.complement = function (a)
{
    return this.except(this.union(a), this.intersect(a));
};

/**
* 求两个集合的交集
{%example
<script>
var a = [1,2,3,4];
var b = [3,4,5,6];
alert(a.intersect(b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的交集
*/
Array.prototype.intersect = function (a)
{
    return this.uniquelize().each(function (o) { return a.contains(o) ? o : null });
};

/**
* 求两个集合的差集
{%example
<script>
var a = [1,2,3,4];
var b = [3,4,5,6];
alert(Array.except(a,b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的差集
*/
Array.prototype.except = function (a)
{

    return this.uniquelize().each(function (o) { return a.contains(o) ? null : o });
};

/**
* 求两个集合的并集
{%example
<script>
var a = [1,2,3,4];
var b = [3,4,5,6];
alert(a.union(b));
</script>
%}
* @param {Array} a 集合A
* @param {Array} b 集合B
* @returns {Array} 两个集合的并集
*/
Array.prototype.union = function (a)
{

    return this.concat(a).uniquelize();
};

Array.prototype.firstOrDefault = function (key, value)
{
    /// <summary>返回序列中满足条件的第一个元素，如果没有查到返回null;</summary>
    /// <param name="key" type="String">属性名/键名</param>
    /// <param name="value" type="Object">值</param>
    /// <returns type="Object" />

    var ins = null;
    for (var i = 0; i < this.length; i++)
    {
        var jsonOb = this[i];
        if (typeof jsonOb[key] != "undefined" && jsonOb[key] == value)
        {
            ins = jsonOb;
            break;
        }
    }
    return ins;
};

Array.prototype.findAll = function (key, value)
{
    /// <summary>返回序列中满足条件的所有元素，如果没有查到返回new Array();</summary>
    /// <param name="key" type="String">属性名/键名</param>
    /// <param name="value" type="Object">值</param>
    /// <returns type="Object[]"/>
    var arr = new Array();
    for (var i = 0; i < this.length; i++)
    {
        var jsonOb = this[i];
        if (typeof jsonOb[key] != "undefined" && jsonOb[key] == value)
        {
            arr.push(jsonOb);
        }
    }
    return arr;
};
Array.prototype.indexOf = function (key, value)
{
    /// <summary>返回关键值对应的索引号</summary>
    /// <param name="key" type="String">属性名/键名</param>
    /// <param name="value" type="String">值</param>
    /// <returns type="Int" />
    var index = -1;
    for (var i = 0; i < this.length; i++)
    {
        var jsonOb = this[i];
        if (typeof jsonOb[key] != "undefined" && jsonOb[key] == value)
        {
            index = i;
            break;
        }
    }
    return index;
}
Array.prototype.lastIndexOf = function (key, value)
{
    /// <summary>返回关键值对应的索引号(倒序查找)</summary>
    /// <param name="key" type="String">属性名/键名</param>
    /// <param name="value" type="String">值</param>
    /// <returns type="Int" />
    var index = -1;
    for (var i = this.length - 1; i >= 0; i--)
    {
        var jsonOb = this[i];
        if (typeof jsonOb[key] != "undefined" && jsonOb[key] == value)
        {
            index = i;
            break;
        }
    }
    return index;
}
Array.prototype.removeFirst = function (key, value)
{
    /// <summary>删除第一个元素</summary>
    var index = this.indexOf(key, value);
    if (index > -1)
    {
        this.splice(index, 1);
        return true;
    }
    return false;
}
Array.prototype.removeAll = function (key, value)
{
    /// <summary>删除所有元素</summary>
    /// <returns type="Int">删除元素个数</returns>
    var status = 0;
    for (var i = 0; i < this.length; i++)
    {
        if (this[i][key] && this[i][key] == value)
        {
            this.splice(i, 1);
            i--;
            status++;
        }
    }
    return status;
}
Array.prototype.copyArray = function ()
{
    /// <summary>数组的深拷贝(基于Jquery框架)</summary>
    /// <returns type="Object[]" />
    var jsonObjs = $.extend(true, {}, this);
    var objs = new Array();
    for (var i = 0; i < this.length; i++)
    {
        objs.push(jsonObjs[i]);
    }
    return objs;
}
Array.prototype.select = function (key)
{
    /// <summary>返回指定列名对应的值集合（例如：对象数组里的“ID”值集合。arr.select("ID")）</summary>
    /// <param name="key" type="String">值名</param>
    var arr = new Array();
    for (var i = 0; i < this.length; i++)
    {
        var jsonOb = this[i];
        if (typeof jsonOb[key] != "undefined")
        {
            arr.push(jsonOb[key]);
        }
    }
    return arr;
}
Array.prototype.orderBy = function (key)
{
    /// <summary>按字段名排序（升序）</summary>
    /// <param name="key" type="String">排序的字段名</param>
    
    for (var i = 0; i < this.length - 1; i++)
    {
        var currentObj = this[i];
        if (typeof currentObj[key] != "undefined")
        {
            for (var j = i + 1; j < this.length; j++)
            {
                var nextObj = this[j];
                var currentValue = null;
                var nextValue = null;
                currentValue = currentObj[key];
                nextValue = nextObj[key];
                if (isNaN(Number(currentValue)) == false && isNaN(Number(nextValue)) == false)
                {//如果是数字则转换成数字来比较
                    currentValue = Number(currentValue);
                    nextValue = Number(nextValue);
                }
                if (currentValue > nextValue)
                {//排序条件

                    this[i] = nextObj;
                    this[j] = currentObj;
                    currentObj = this[i];
                }
            }
        }
    }
}
Array.prototype.maxArray = function (key)
{
    /// <summary>最大值集合（目前key只能为Number类型）</summary>
    var max = null;
    var returnValue = new Array();
    for (var i = 0; i < this.length; i++)
    {
        var jsonOb = this[i];
        if (typeof jsonOb[key] != "undefined" && jsonOb[key] != null)
        {
            if (max == null) { max = jsonOb[key]; }
            max = jsonOb[key] > max ? jsonOb[key] : max;
        }
    }
    if (max != null)
    {
        returnValue = this.findAll(key, max);
    }
    return returnValue;
}
Array.prototype.addRange = function (arr)
{
    if (arr)
    {
        for (var i = 0; i < arr.length; i++)
        {
            this.push(arr[i]);
        }
    }
}
Array.prototype.findContain = function (key, keyArr)
{/// <summary>给定字段名对应值属于存在于某个数组的筛选出来</summary>
    /// <param name="key" type="String">属性名字</param>
    /// <param name="keyArr" type="Array">key数组(如:id字符串数组)</param>
    var returnValue = new Array();
    if (keyArr)
    {
        for (var i = 0; i < keyArr.length; i++)
        {
            var items = this.findAll(key, keyArr[i]);
            if (items.length > 0)
            {
                returnValue.addRange(items);
            }
        }
    }
    return returnValue
}


