const organization = require("../../services/survey/survey");
const surveyForm = require("../../services/survey/survey");
const questions = require("../../services/survey/survey");
const options = require("../../services/survey/survey");
const surveyResult = require("../../services/survey/survey");
const surveyResultDetails = require("../../services/survey/survey");
const surveyInfo = require("../../services/survey/survey");
nodemailer = require('nodemailer');
exports.createOrganization = (req, res) => {
    organization.createOrganization(req,res);
  };
  exports.createSurvey = (req, res) => {
    surveyForm.createSurvey(req,res);
  }; 
  exports.createQuestions = (req, res) => {
    questions.createQuestions(req,res);
  };  
  exports.createOptions = (req, res) => {
    options.createOptions(req,res);
  }; 
  exports.createSurveyResult = (req, res) => {
    surveyResult.createSurveyResult(req,res);
  }; 
  exports.createSurveyResultDetails = (req, res) => {
    surveyResultDetails.createSurveyResultDetails(req,res);
  };  
  exports.getAllSurvey = (req, res) => {
    surveyForm.getAllSurvey(req,res);
  };  
  exports.getAllSurveyResult = (req, res) => {
    surveyResult.getAllSurveyResult(req,res);
  };
  exports.getAllSurveyResultDetails = (req, res) => {
    surveyResultDetails.getAllSurveyResultDetails(req,res);
  }; 
  exports.getAllOrganization = (req, res) => {
    organization.getAllOrganization(req,res);
  }; 
  exports.getOneSurvey = (req, res) => {
    surveyForm.getOneSurvey(req,res);
  }; 
  exports.getOneSurveyResult = (req, res) => {
    surveyResult.getOneSurveyResult(req,res);
  }; 
  exports.getOneSurveyResultDetails = (req, res) => {
    surveyResultDetails.getOneSurveyResultDetails(req,res);
  };
  exports.getOneOrganization = (req, res) => {
    organization.getOneOrganization(req,res);
  }; 
  exports.getAllCountSurveyResultDetails = (req, res) => {
    surveyResultDetails.getAllCountSurveyResultDetails(req,res);
  }; 
  exports.getAllSingleCountSurveyResultDetails = (req, res) => {
    surveyResultDetails.getAllSingleCountSurveyResultDetails(req,res);
  }; 
  exports.createQuestionWithOptions = (req, res) => {
    surveyResultDetails.createQuestionWithOptions(req,res);
  }; 
  exports.createSurveyinfo = (req, res) => {
    surveyInfo.createSurveyinfo(req,res);
  }; 
  exports.getAllsurveyinfoCount = (req, res) => {
    surveyInfo.getAllsurveyinfoCount(req,res);
  }; 
  exports.getOneDatesurveyinfoCount = (req, res) => {
    surveyInfo.getOneDatesurveyinfoCount(req,res);
  }; 
  exports.getOneCurrentsurveyinfoCount = (req, res) => {
    surveyInfo.getOneCurrentsurveyinfoCount(req,res);
  }; 
  exports.getOneWeeklysurveyinfoCount = (req, res) => {
    surveyInfo.getOneWeeklysurveyinfoCount(req,res);
  }; 
  exports.getAllOrgWeeklysurveyinfoCount = (req, res) => {
    surveyInfo.getAllOrgWeeklysurveyinfoCount(req,res);
  }; 
  exports.getAllOrgCurrentDateSurveyInfoCount = (req, res) => {
    surveyInfo.getAllOrgCurrentDateSurveyInfoCount(req,res);
  }; 
  exports.getWeeklyReportAnswer3Count = (req, res) => {
    surveyInfo.getWeeklyReportAnswer3Count(req,res);
  }; 
  exports.getWeeklyReportAnswerCounts = (req, res) => {
    surveyInfo.getWeeklyReportAnswerCounts(req,res);
  }; 
  exports.overallReportAnswerCounts = (req, res) => {
    surveyInfo.overallReportAnswerCounts(req,res);
  }; 
  exports.getWeeklySurveyInfoCounts = (req, res) => {
    surveyInfo.getWeeklySurveyInfoCounts(req,res);
  }; 

  exports.getAllSingleCountSurveyinfosResultDetails = (req, res) => {
    surveyInfo.getAllSingleCountSurveyinfosResultDetails(req,res);
  }; 
  exports.getOneDatesurveyinfoCountAndData = (req, res) => {
    surveyInfo.getOneDatesurveyinfoCountAndData(req,res);
  }; 