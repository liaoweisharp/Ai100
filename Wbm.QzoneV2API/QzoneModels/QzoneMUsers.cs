/*
 This file was create by Xusion at 2011.10.27
 */
using System;
namespace Wbm.QzoneV2API.QzoneModels
{
    /// <summary>
    /// 实体类MUsers 。
    /// </summary>
    [Serializable]
    public class QzoneMUsers
    {
        public QzoneMUsers()
        { }
        #region Model
        private string _id;
        private string _nickname;
        private string _figureurl;
        private string _figureurl_1;
        private string _figureurl_2;
        private string _gender;

        /// <summary>
        /// 用户UID 
        /// </summary>
        public string id
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 昵称 
        /// </summary>
        public string nickname
        {
            set { _nickname = value; }
            get { return _nickname; }
        }
               
        /// <summary>
        /// 自定义图像
        /// </summary>
        public string figureurl
        {
            set { _figureurl = value; }
            get { return _figureurl; }
        }
        /// <summary>
        /// 自定义图像1
        /// </summary>
        public string figureurl_1
        {
            set { _figureurl_1 = value; }
            get { return _figureurl_1; }
        }
        /// <summary>
        /// 自定义图像2
        /// </summary>
        public string figureurl_2
        {
            set { _figureurl_2 = value; }
            get { return _figureurl_2; }
        }
       
        /// <summary>
        /// 性别, 男，女
        /// </summary>
        public string gender
        {
            set { _gender = value; }
            get { return _gender; }
        }
        #endregion Model

    }
}

