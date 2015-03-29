using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using JEWS;
using JEWS.EngineStudyGuide;

namespace JEWS
{
    [Serializable]
    public class TestManage
    {
        //用已有的参数值进行替换（已经替换过或者数据库内已经存在）
        public static QuestionAlgorithmValueWrapper[] questionAndReferenceAnswersChanage(ReferenceAnswersWrapper[] referenceAnswerWrapper, QuestionWrapper[] questionWrapperArray, QuestionAlgorithmValueWrapper[] qavWs, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            List<QuestionAlgorithmValueWrapper> lstQAV = new List<QuestionAlgorithmValueWrapper>();
            string algorithmImgUrl = System.Configuration.ConfigurationManager.AppSettings["algorithmImgUrl"].ToString();
            List<QuestionWrapper> qList = new List<QuestionWrapper>();
            List<ReferenceAnswersWrapper> raList = new List<ReferenceAnswersWrapper>();
            if (questionWrapperArray != null && questionWrapperArray.Length > 0)
            {
                foreach (QuestionWrapper q in questionWrapperArray)
                {
                    if (q.algorithmFlag == "1")
                    {
                        qList.Add(q);
                        if (referenceAnswerWrapper != null && referenceAnswerWrapper.Length > 0)
                        {
                            foreach (ReferenceAnswersWrapper ra in referenceAnswerWrapper)
                            {
                                if (ra.questionId == q.id)
                                {
                                    raList.Add(ra);
                                }
                            }
                        }
                    }

                }
            }
            if (qList != null && qList.Count > 0)
            {
                QuestionWrapper[] qws = new QuestionWrapper[qList.Count];
                qList.CopyTo(qws, 0);


                Hashtable hsQav = new Hashtable();
                if (qavWs != null && qavWs.Length > 0)
                {
                    foreach (QuestionAlgorithmValueWrapper qavW in qavWs)
                    {
                        ArrayList qavList = new ArrayList();
                        if (hsQav.Contains(qavW.questionId))
                        {

                            foreach (DictionaryEntry dr in hsQav)
                            {
                                if (dr.Key.ToString() == qavW.questionId)
                                {
                                    qavList = dr.Value as ArrayList;
                                    break;
                                }
                            }

                            qavList.Add(qavW);
                        }
                        else
                        {
                            qavList.Add(qavW);
                            hsQav.Add(qavW.questionId, qavList);
                        }
                    }
                }

                foreach (DictionaryEntry dr in hsQav)
                {
                    for (int i = 0; i < qList.Count; i++)
                    {
                        if (dr.Key.ToString() == qList[i].id)
                        {
                            ArrayList qavList = dr.Value as ArrayList;
                            //jason种子
                            qList[i].qpvSeedId = ((QuestionAlgorithmValueWrapper)qavList[0]).qpvSeedId;
                            foreach (QuestionAlgorithmValueWrapper qavW in qavList)
                            {
                                if (qavW.PValue == null)
                                {
                                    continue;
                                }
                                bool flag = false;
                                if (qavW.PValue.Contains("gd."))
                                {
                                    string qv = qavW.PValue;
                                    if (qv.ToLower().IndexOf("<img src='") == 0 || qv.ToLower().IndexOf("<img src=\"") == 0)
                                    {
                                        int indexOfPar = qv.IndexOf("?par=");
                                        if (qv.ToLower().IndexOf("width") != -1 && qv.ToLower().IndexOf("height") != -1)
                                        {

                                            qv.Substring(indexOfPar + 5, qv.IndexOf(" width") - indexOfPar - 6);
                                        }
                                        else
                                        {
                                            qv = qv.Substring(indexOfPar + 5, qv.Length - 10 - indexOfPar);
                                        }
                                    }

                                    if (qv.ToLower().IndexOf("imgengine.aspx?par=") == -1)
                                    {
                                        string imgSize = "";
                                        int gdIndex = qv.ToLower().Trim().IndexOf("gd.ps");
                                        if (gdIndex == -1)
                                        {
                                            if (qv.ToLower().Trim().Contains("gd.fx"))
                                            {
                                                gdIndex = qv.ToLower().Trim().IndexOf("gd.fx");
                                            }
                                            if (qv.ToLower().Trim().Contains("gd.xy"))
                                            {
                                                gdIndex = qv.ToLower().Trim().IndexOf("gd.xy");
                                            }
                                        }
                                        if (gdIndex != -1)
                                        {
                                            if (gdIndex != 0)
                                            {
                                                string str = qv.Substring(1, qv.IndexOf("gd.") - 2).Trim();
                                                int index = str.IndexOf(",");
                                                if (index != -1)
                                                {
                                                    float width = float.Parse(str.Substring(0, index));
                                                    float height = float.Parse(str.Substring(index + 1));
                                                    imgSize = " width='" + (width * 0.65) + "' height='" + (height * 0.65) + "' ";
                                                }
                                            }
                                            else
                                            {
                                                imgSize = " width='280' height='280' ";
                                            }
                                        }

                                        QuestionAlgorithmValueWrapper _qavW = TOOLS.ObjectUtil.CopyObjectPoperty<QuestionAlgorithmValueWrapper, QuestionAlgorithmValueWrapper>(qavW);
                                        _qavW.PValue = "<img src='" + algorithmImgUrl + qv + "'" + imgSize + "/>";
                                        lstQAV.Add(_qavW);
                                        flag = true;

                                        qv = Uri.EscapeDataString(qv);
                                        qv = "<img src='" + algorithmImgUrl + qv + "'" + imgSize + "/>";
                                    }

                                    qavW.PValue = qv;
                                }
                                if (!flag)
                                {
                                    lstQAV.Add(qavW);
                                }

                                qList[i].content = qList[i].content != null ? qList[i].content.Replace(qavW.qpName, qavW.PValue) : null;
                                //qList[i].content = qList[i].content.Replace("+-", "-");
                                qList[i].solution = qList[i].solution != null ? qList[i].solution.Replace(qavW.qpName, qavW.PValue) : null;
                                qList[i].hint = qList[i].hint != null ? qList[i].hint.Replace(qavW.qpName, qavW.PValue) : null;
                                for (int a = 0; a < raList.Count; a++)
                                {
                                    if (qavW.questionId == raList[a].questionId)
                                    {
                                        if (raList[a].content != null)
                                        {
                                            raList[a].content = raList[a].content.Replace(qavW.qpName, qavW.PValue);
                                        }
                                        if (raList[a].feedback != null)
                                        {
                                            raList[a].feedback = raList[a].feedback.Replace(qavW.qpName, qavW.PValue);
                                        }
                                    }
                                }

                            }

                        }
                    }

                }

                for (int i = 0; i < questionWrapperArray.Length; i++)
                {
                    foreach (QuestionWrapper ql in qList)
                    {
                        if (questionWrapperArray[i].id == ql.id)
                        {
                            questionWrapperArray[i] = ql;
                            break;
                        }
                    }
                }
                if (referenceAnswerWrapper != null && referenceAnswerWrapper.Length > 0)
                {
                    for (int ii = 0; ii < referenceAnswerWrapper.Length; ii++)
                    {
                        foreach (ReferenceAnswersWrapper ral in raList)
                        {
                            if (referenceAnswerWrapper[ii].id == ral.id)
                            {
                                referenceAnswerWrapper[ii] = ral;

                            }
                        }
                    }
                }

            }
            return lstQAV.ToArray();
        }

        //返回某道题下面根据不同种子生成的题和对应种子题的答案
        public static IList getQuestionAndReferenceAnswersSeedList(string questionId, bool existFlag, JEWS.EngineStudyGuide.UserExtend userExtend)
        {
            CmsEngine cmsEngine = new CmsEngine();
            StudyGuideEngine studyGuideEngine = new JEWS.StudyGuideEngine();

            IList al = new ArrayList();
            if (existFlag)//已经存在的种子生成的题信息
            {
                string[] _qpvSeedIds = cmsEngine.getQpvSeedList(questionId);
                if (_qpvSeedIds == null || _qpvSeedIds.Length == 0)
                {
                    return null;
                }
                // QuestionWrapper[] questions = BBLL.CmsManage.getQuestionByQpvSeedIds(questionId, _qpvSeedIds, usersExtendWrapper);///LY
                QuestionAlgorithmValueWrapper[] qavws = cmsEngine.getQuestionAlgorithmValueQpvSeedIds(_qpvSeedIds, questionId);
                QuestionWrapper qws = studyGuideEngine.getQuestionEdit(questionId, userExtend);
                ReferenceAnswersWrapper[] raws = studyGuideEngine.getReferenceAnswersList(questionId, null, userExtend);

                foreach (string _qpvSeedId in _qpvSeedIds)
                {
                    QuestionAlgorithmValueWrapper[] qavwArray = (from ins in qavws where ins.qpvSeedId == _qpvSeedId select ins).ToArray();
                    QuestionWrapper qw = TOOLS.ObjectUtil.CopyObjectPoperty<QuestionWrapper, QuestionWrapper>(qws);

                    ReferenceAnswersWrapper[] rawArray = TOOLS.ObjectUtil.CopyObjectsPoperty<ReferenceAnswersWrapper, ReferenceAnswersWrapper>(raws.ToList()).ToArray();
                    questionAndReferenceAnswersChanage(rawArray, new QuestionWrapper[] { qw }, qavwArray, userExtend);
                    ArrayList _al = new ArrayList();
                    _al.Add(qw);
                    _al.Add(rawArray);
                    _al.Add(_qpvSeedId);
                    al.Add(_al);
                }
                return al;
            }
            else
            { //根据种子新产生不同于种子生成的已存在的题

                QuestionAlgorithmWrapper[] qawArray = cmsEngine.getQuestionAlgorithmList(questionId, userExtend);
                if (qawArray == null || qawArray.Length == 0)
                {
                    return null;
                }
                QuestionAlgorithmValueWrapper[] qavwArray = cmsEngine.getQuestionAlgorithmValueAuto(qawArray, questionId);
                if (qavwArray == null || qavwArray.Length == 0)
                {
                    return null;
                }
                QuestionAlgorithmValueWrapper[] qavwArray0 = TOOLS.ObjectUtil.CopyObjectsPoperty<QuestionAlgorithmValueWrapper, QuestionAlgorithmValueWrapper>(qavwArray.ToList()).ToArray();
                ArrayList _al = new ArrayList();
                QuestionWrapper qw = studyGuideEngine.getQuestionEdit(questionId, userExtend);
                ReferenceAnswersWrapper[] raws = studyGuideEngine.getReferenceAnswersList(questionId, null, userExtend);
                QuestionAlgorithmValueWrapper[] _qavwArray = questionAndReferenceAnswersChanage(raws, new QuestionWrapper[] { qw }, qavwArray, userExtend);
                _al.Add(qw);
                _al.Add(raws);
                _al.Add(qw.qpvSeedId);
                _al.Add(qavwArray0);
                al.Add(_al);
                return al;
            }
        }

        //返回任务整体报告数据
        public static IList getAssignIntegratedData(string assignmentId, string testId, string sectionId, string userId, JEWS.EngineStudyGuide.UserExtend userExtend )
        {
            ArrayList retList = new ArrayList();
            StudyGuideEngine sge = new StudyGuideEngine();

            #region 返回考题以及参考答案
            QuestionWrapper[] qws = sge.getQuestionForTestId(testId, "", userId,userExtend);
            retList.Add(qws);
            if (qws != null)
            {
                List<anyType2anyTypeMapEntry> lst2 = new List<anyType2anyTypeMapEntry>();
                foreach (QuestionWrapper qs in qws)
                {
                    anyType2anyTypeMapEntry ht = new anyType2anyTypeMapEntry();
                    ht.key = qs.id;
                    ht.value = qs.qpvSeedId;
                    lst2.Add(ht);
                }
                ReferenceAnswersWrapper[] raws = sge.getReferenceAnswersListByQidQsIds(lst2.ToArray(), userExtend);
                retList.Add(raws);
            }
            else
            {
                retList.Add(null);
            }
            #endregion

            #region 得到任务中所有题的正确率统计
            TestResultQuestionReportWrapper[] correctNums = sge.getQuestionCorrectPercentage(assignmentId, testId, sectionId, userExtend);
            retList.Add(correctNums);
            #endregion

            #region 得到答案的正确率统计
            if (qws != null)
            {
                string[] questionIds = (from ins in qws where new string[] { "1", "2", "3" }.Contains(ins.questionTypeId) select ins.id).ToArray();
                anyType2anyTypeMapEntry[] answerNums = sge.referenceAnswersBaseByTest(assignmentId, testId, questionIds, sectionId, userExtend);
                retList.Add(answerNums);
            }
            else
            {
                retList.Add(null);
            }
            #endregion

            return retList;
        }
    }
}
