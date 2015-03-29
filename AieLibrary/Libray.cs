using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AieLibrary
{
    public class Libray
    {
        public static string ConvertArrayToString(String[] array)
        {
            StringBuilder sb = new StringBuilder();
            if (array != null)
            {
                for (int i = 0; i < array.Length;i++ )
                {
                    if (i != array.Length - 1)
                    {
                        sb.Append("'"+array[i] + "',");
                    }
                    else
                    {
                        sb.Append("'"+array[i]+"'");
                    }
                    
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// 获取随机字符串
        /// </summary>
        /// <param name="strLength">字符串长度</param>
        /// <param name="Seed">随机函数种子值</param>
        /// <returns>指定长度的随机字符串</returns>
        /// 
        public static string GetString(int strLength, params int[] Seed)
        {
            int randomInt = 0;
            string tempStr = DateTime.Now.Ticks.ToString();
            tempStr = tempStr.Substring(tempStr.Length - 11, 9);
            randomInt = Convert.ToInt32(tempStr);

            string strSep = ",";
            char[] chrSep = strSep.ToCharArray();
            string strChar = "2,3,4,6,7,8,9,A,B,C,D,E,F,G,H,J,K,M,N,P,Q,R,T,U,V,W,X,Y,Z";
            string[] aryChar = strChar.Split(chrSep, strChar.Length);
            string strRandom = string.Empty;
            Random Rnd;
            if (Seed != null && Seed.Length > 0)
            {
                Rnd = new Random(Seed[0] + randomInt);
            }
            else
            {
                Rnd = new Random(randomInt);
            }
            //生成随机字符串
            for (int i = 0; i < strLength; i++)
            {
                strRandom += aryChar[Rnd.Next(aryChar.Length)];
            }
            return strRandom;
        }
    }
}
