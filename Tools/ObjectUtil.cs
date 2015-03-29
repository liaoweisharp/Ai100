using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TOOLS
{
    public class ObjectUtil
    {
        ///// <summary>
        ///// 对象属性拷贝(全匹配拷贝)
        ///// </summary>
        ///// <param name="sourceObject">源对象</param>
        ///// <param name="targetObject">目标对象</param>
        ///// <returns>目标对象</returns>
        //public static object CopyObjectPoperty(object sourceObject, object targetObject)
        //{
        //    Type soutype = sourceObject.GetType();
        //    Type tartype = targetObject.GetType();
        //    PropertyInfo[] pis = soutype.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        //    if (null != pis)
        //    {
        //        foreach (PropertyInfo pi in pis)
        //        {
        //            string propertyname = pi.Name;
        //            PropertyInfo pit = tartype.GetProperty(propertyname);
        //            if (pit != null)
        //            {
        //                pit.SetValue(targetObject, pi.GetValue(sourceObject, null), null);
        //            }
        //        }
        //    }
        //    return targetObject;
        //}
        ///// <summary>
        ///// 对象集合属性拷贝(全匹配拷贝)
        ///// </summary>
        ///// <param name="sourceObjects">源对象集合</param>
        ///// <param name="targetObjects">目标对象集合</param>
        ///// <returns></returns>
        //public static List<object> CopyObjectsPoperty(List<object> sourceObjects, List<object> targetObjects)
        //{
        //    for (int i = 0; i < sourceObjects.Count; i++)
        //    {
        //        object sourceObject = sourceObjects[i];
        //        object targetObject = targetObjects[i];
        //        CopyObjectPoperty(sourceObject, targetObject);
        //    }
        //    return targetObjects;
        //}
        /// <summary>
        /// 对象集合属性拷贝(全匹配拷贝)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="K"></typeparam>
        /// <param name="sourceObjects"></param>
        /// <param name="targetObjects"></param>
        /// <returns></returns>
        public static List<T> CopyObjectsPoperty<T, K>(List<K> sourceObjects, List<T> targetObjects)
        {
            for (int i = 0; i < sourceObjects.Count; i++)
            {
                K sourceObject = sourceObjects[i];
                //T targetObject = targetObjects[i];
                T targetObject = System.Activator.CreateInstance<T>();
                targetObjects.Add(CopyObjectPoperty<T, K>(sourceObject, targetObject));
            }
            return targetObjects;
        }

        /// <summary>
        /// 对象集合属性拷贝(全匹配拷贝)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="K"></typeparam>
        /// <param name="sourceObjects"></param>
        /// <param name="targetObjects"></param>
        /// <returns></returns>
        public static List<T> CopyObjectsPoperty<T, K>(List<K> sourceObjects)
        {
            List<T> targetObjects = new List<T>();
            for (int i = 0; i < sourceObjects.Count; i++)
            {
                K sourceObject = sourceObjects[i];
                //T targetObject = targetObjects[i];
                T targetObject = System.Activator.CreateInstance<T>();
                targetObjects.Add(CopyObjectPoperty<T, K>(sourceObject, targetObject));
            }
            return targetObjects;
        }

        /// <summary>
        /// 对象属性拷贝(全匹配拷贝)
        /// </summary>
        /// <param name="sourceObject">源对象</param>
        /// <param name="targetObject">目标对象</param>
        /// <returns>目标对象</returns>
        public static T CopyObjectPoperty<T, K>(K sourceObject, T targetObject)
        {
            if (sourceObject == null)
            {
                return default(T);
            }
            Type soutype = sourceObject.GetType();
            Type tartype = targetObject.GetType();
            PropertyInfo[] pis = soutype.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (null != pis)
            {
                foreach (PropertyInfo pi in pis)
                {
                    string propertyname = pi.Name;
                    PropertyInfo pit = tartype.GetProperty(propertyname);
                    if (pit != null && pi.PropertyType.FullName == pit.PropertyType.FullName)
                    {
                        pit.SetValue(targetObject, pi.GetValue(sourceObject, null), null);
                    }
                }
            }
            return targetObject;
        }

        /// <summary>
        /// 对象属性拷贝(全匹配拷贝)
        /// </summary>
        /// <param name="sourceObject">源对象</param>
        /// <param name="targetObject">目标对象</param>
        /// <returns>目标对象</returns>
        public static T CopyObjectPoperty<T, K>(K sourceObject)
        {
            T targetObject = System.Activator.CreateInstance<T>();
            if (sourceObject == null)
            {
                return default(T);
            }

            Type soutype = sourceObject.GetType();
            Type tartype = targetObject.GetType();
            PropertyInfo[] pis = soutype.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (null != pis)
            {
                foreach (PropertyInfo pi in pis)
                {
                    string propertyname = pi.Name;
                    PropertyInfo pit = tartype.GetProperty(propertyname);
                    if (pit != null && pi.PropertyType.FullName == pit.PropertyType.FullName)
                    {
                        pit.SetValue(targetObject, pi.GetValue(sourceObject, null), null);
                    }
                }
            }
            return targetObject;
        }
        /// <summary>
        /// 得到相同的属性的对象集合(前提:T类型必须实现了Equals重写)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="firstList"></param>
        /// <param name="secondList"></param>
        /// <param name="popertys">不需要比较的字段名</param>
        /// <returns></returns>
        public static List<T> AllEqualPopertysOfList<T>(List<T> firstList, List<T> secondList, params string[] popertys)
        {
            List<T> returnValue = new List<T>();
            IEnumerable<T> list_Update = firstList.Intersect<T>(secondList);
            foreach (T ins in list_Update)
            {
                T fir_Ins = firstList.Intersect<T>(new List<T>() { ins }).ToArray()[0];
                T sec_Ins = secondList.Intersect<T>(new List<T>() { ins }).ToArray()[0];
                bool isEqual = EqualPopertysOfObject<T>(fir_Ins, sec_Ins, popertys);
                if (isEqual)
                {
                    returnValue.Add(fir_Ins);
                }
            }
            return returnValue;
        }
        /// <summary>
        /// 比较两个相同类型的对象是否全值相等。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="firstObjcet"></param>
        /// <param name="secondObjcet"></param>
        /// <param name="popertys">不需要比较的字段名</param>
        /// <returns></returns>
        public static bool EqualPopertysOfObject<T>(T firstObjcet, T secondObjcet, params string[] popertys)
        {
            bool returnValue = true;
            Type firType = firstObjcet.GetType();
            Type secType = secondObjcet.GetType();
            PropertyInfo[] pis = firType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (firType != null && secType != null)
            {
                foreach (PropertyInfo pi in pis)
                {
                    string propertyname = pi.Name;
                    if (popertys.Contains(propertyname))
                    {//排除的属性不参与比较
                        continue;
                    }
                    PropertyInfo pit = secType.GetProperty(propertyname);
                    Object firValue = pi.GetValue(firstObjcet, null);
                    Object secValue = pit.GetValue(secondObjcet, null);
                    if (firValue == null || secValue == null)
                    {
                        if (firValue != secValue)//有一个属性值不一样就表示不相同
                        {
                            returnValue = false;
                            break;
                        }
                    }
                    else if (firValue.Equals(secValue) == false)//有一个属性值不一样就表示不相同
                    {
                        returnValue = false;
                        break;
                    }
                }
            }
            else
            {
                returnValue = false;
            }
            return returnValue;
        }
        /// <summary>
        /// 将DataTable转换成指定的对象集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static IList<T> ConvertDataTableToObjects<T>(DataTable dt)
        {
            IList<T> targetObjects = new List<T>();

            if (dt != null && dt.Rows.Count > 0)
            {
                string[] colNameList = GetAssignableColumns<T>(dt.Columns);
                targetObjects = ConvertDataRowsToObjects<T>(dt.Rows, colNameList);
            }

            return targetObjects;
        }

        /// <summary>
        /// 将DataTable的行转换成T对象的集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="rows"></param>
        /// <param name="colNameList"></param>
        /// <returns></returns>
        private static IList<T> ConvertDataRowsToObjects<T>(DataRowCollection rows, string[] colNameList)
        {
            IList<T> targetObjects = new List<T>();

            foreach (DataRow dr in rows)
            {
                T targetObject = System.Activator.CreateInstance<T>();
                Type tartype = targetObject.GetType();  //target type
                foreach (string colName in colNameList)
                {
                    PropertyInfo pit = tartype.GetProperty(colName);
                    if (!(dr[colName] is System.DBNull))
                    {
                        pit.SetValue(targetObject, dr[colName], null);
                    }

                }
                targetObjects.Add(targetObject);
            }

            return targetObjects;
        }

        /// <summary>
        /// 返回DataTable中可赋值给T对象的列
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cols"></param>
        /// <returns></returns>
        private static string[] GetAssignableColumns<T>(DataColumnCollection cols)
        {
            IList<string> assignableColumn = new List<string>();

            IList<string> colNameList = new List<string>(cols.Count);
            foreach (DataColumn col in cols)
            {
                colNameList.Add(col.ColumnName);
            }

            T targetObject = System.Activator.CreateInstance<T>();
            Type tartype = targetObject.GetType();  //target type
            bool isAssignable = false;
            foreach (string colName in colNameList)
            {
                PropertyInfo pit = tartype.GetProperty(colName);
                if (pit != null && pit.CanWrite)
                {
                    isAssignable = pit.PropertyType.IsAssignableFrom(cols[colName].DataType);
                    if (isAssignable)   //判断目标属性类型是否兼容DataTable的列类型
                    {
                        assignableColumn.Add(colName);
                    }
                }

            }

            return assignableColumn.ToArray<string>();
        }


        /// <summary> 
        /// 去除DataTable中的重复项 
        /// </summary> 
        /// <param name="objdatatable">要去除得复项的DataTable对象</param> 
        /// <param name="columnsname">指定要消除的DataTable对象的列名</param> 
        /// <returns></returns> 
        public static DataTable GetDataTableDistinct(DataTable objdatatable, string[] columnsname)
        {
            DataView dv = new DataView(objdatatable);
            DataTable objDataTable = dv.ToTable(true, columnsname);
            return objDataTable;
        }


    }
}