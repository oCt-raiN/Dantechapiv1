module.exports = app => {
    const surveyForm = require("../../controllers/organization/organization.controller");
    const questions = require("../../controllers/organization/organization.controller");
    const options = require("../../controllers/organization/organization.controller");
    const surveyResult = require("../../controllers/organization/organization.controller");
    const surveyResultDetails = require("../../controllers/organization/organization.controller");
    const surveyInfo = require("../../controllers/organization/organization.controller");
    const { authJwt } = require("../../middleware/index.js");
    const { verifySignUp } = require("../../middleware/index.js");
    
  
    var router = require("express").Router();
        app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    

      // create survey
      router.post("/createSurvey",surveyForm.createSurvey);
      router.post("/createQuestions",questions.createQuestions);
      router.post("/createOptions",options.createOptions);
      router.post("/createSurveyResult",surveyResult.createSurveyResult);
      router.post("/createSurveyResultDetails",surveyResultDetails.createSurveyResultDetails);
      router.get("/getAllSurvey",surveyForm.getAllSurvey);
      router.get("/getAllSurveyResult",surveyResult.getAllSurveyResult);
      router.get("/getAllSurveyResultDetails",surveyResultDetails.getAllSurveyResultDetails);
      router.post("/getOneSurvey",surveyForm.getOneSurvey);
      router.post("/getOneSurveyResult",surveyResult.getOneSurveyResult);
      router.post("/getOneSurveyResultDetails",surveyResultDetails.getOneSurveyResultDetails);
      router.get("/getAllCountSurveyResultDetails",surveyResultDetails.getAllCountSurveyResultDetails);
      router.post("/getAllSingleCountSurveyResultDetails",surveyResultDetails.getAllSingleCountSurveyResultDetails);
      router.post("/createQuestionWithOptions",surveyResultDetails.createQuestionWithOptions);
      router.post("/createSurveyinfo",[authJwt.verifyTokenwithid],surveyInfo.createSurveyinfo);
      router.post("/getAllSingleCountSurveyinfosResultDetails",surveyInfo.getAllSingleCountSurveyinfosResultDetails);
      router.post("/getAllsurveyinfoCount",surveyInfo.getAllsurveyinfoCount);
      router.post("/getOneDatesurveyinfoCount",surveyInfo.getOneDatesurveyinfoCount);
      router.post("/getOneCurrentsurveyinfoCount",surveyInfo.getOneCurrentsurveyinfoCount);
      router.post("/getOneWeeklysurveyinfoCount",surveyInfo.getOneWeeklysurveyinfoCount);
      router.post("/getAllOrgWeeklysurveyinfoCount",surveyInfo.getAllOrgWeeklysurveyinfoCount);
      router.post("/getAllOrgCurrentDateSurveyInfoCount",surveyInfo.getAllOrgCurrentDateSurveyInfoCount);
      router.post("/getWeeklyReportAnswer3Count",surveyInfo.getWeeklyReportAnswer3Count);
      router.post("/getWeeklyReportAnswerCounts",surveyInfo.getWeeklyReportAnswerCounts);
      router.post("/overallReportAnswerCounts",surveyInfo.overallReportAnswerCounts);
      router.post("/getWeeklySurveyInfoCounts",surveyInfo.getWeeklySurveyInfoCounts);
      router.post("/getOneDatesurveyinfoCountAndData",surveyInfo.getOneDatesurveyinfoCountAndData);

    
app.use('/api/surveyForm', router);    
};    