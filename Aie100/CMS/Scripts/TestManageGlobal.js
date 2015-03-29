/*
* 考试管理全局变量定义
*/

var ISBN = "";
//KnowledgePoints数据维护对象
var KnowledgePointsDataSvr = null;
//可选的书
var BookWrapperArray = [];
//考试模板
var TestModelArray = [];
//考试题型
var TestQuestionTypeArray = [];
//模板设置项
var TestSampleArray = [];
//试题库
var _TestQuestionBank = [];
//试题分组数据(每个分组描述一个题型的数据)
var _TestQuestionGroups = [];
//备选题库(添加、替换题使用)
var AlternativeQuestions = [];
//已选题
var SelectedQuestions = [];
//树结构数据
var _BookStructureData = null;
//知识点与题的关系集合
var LoQuestionArray = [];

var InputTestNameTip = "请输入试卷名称";
var $dvTestModelList = null;
var $_dvTestModel = null;