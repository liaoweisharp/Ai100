using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Tools
{
    public class SpecialChars
    {
        public static string handleSpecialChars(string inputString)
        {
            StringBuilder sb = new StringBuilder();
            if (string.IsNullOrEmpty(inputString) == false)
            {
                char[] old = inputString.ToCharArray();
                for (int i = 0; i < old.Length; i++)
                {
                    char c = old[i];
                    switch (c)
                    {
                        case '[':
                            {
                                sb.Append("[[]");
                                break;
                            }
                        case '\'':
                            {
                                sb.Append("\'\'");
                                break;
                            }
                        case '%':
                            {
                                sb.Append("[%]");
                                break;
                            }
                        case '_':
                            {
                                sb.Append("[_]");
                                break;
                            }
                        case '^':
                            {
                                sb.Append("[^]");
                                break;
                            }
                        default:
                            {
                                sb.Append(c); break;
                            }
                    }
                }

            }
            return sb.ToString();

        }
    }
}
