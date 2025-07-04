const app = getApp()
var courseService = require('../../services/courseService.js');

Page({
  data: {
    pageName: '考试',
    result: [],
    showModal: false,
    questions: [],
    showAnswer: false,
    opacity: false,
    courseId: '',
    hasValue: false,
    postQuestions: [],
    submit: false,
    isDisable: false,
    isPass: false,
    exam: {},
    radioAnswers: [],
    score: 0
  },
  onRadioChange(event) {
    var answers = this.data.radioAnswers;
    var questionId = event.currentTarget.id;
    var optionId = event.detail;
    if (answers.length == 0) {
      answers.push({
        questionId: questionId,
        optionIds: [optionId]
      });
    } else {
      var flag = false;
      for (var i = 0; i < answers.length; i++) {
        if (answers[i].questionId == questionId) {
          answers[i].optionIds = [optionId];
          flag = true;
          break;
        }
      }

      if (!flag) {
        answers.push({
          questionId: questionId,
          optionIds: [optionId]
        });
      }
    }

    this.setData({
      radioAnswers: answers
    });

  },
  onCheckboxChange(event) {
    this.setData({
      result: event.detail,
    });
    var questions = this.data.questions;
    var options = [];
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].id == event.currentTarget.id) {
        options = questions[i].questionOptions;
        break;
      }
    }

    var selectedOptions = event.detail;
    var newOptions = [];
    for (var i = 0; i < options.length; i++) {
      for (var j = 0; j < selectedOptions.length; j++) {
        if (options[i].id == selectedOptions[j]) {
          newOptions.push(selectedOptions[j]);
        }
      }
    }

    var postQuestions = this.data.postQuestions;
    var postQuestion = {
      questionId: event.currentTarget.id,
      optionIds: newOptions
    };

    var flag = postQuestions.filter(x => x.questionId == postQuestion.questionId);
    if (flag.length > 0) {
      for (var i = 0; i < postQuestions.length; i++) {
        if (postQuestions[i].questionId == postQuestion.questionId) {
          postQuestions[i] = postQuestion;
          break;
        }
      }
    } else {
      postQuestions.push(postQuestion);
    }

    this.setData({
      postQuestions: postQuestions
    });

    if (event.detail.length > 0) {
      this.setData({
        hasValue: true,
      });
    } else {
      this.setData({
        hasValue: false,
      });
    }
  },
  onLoad: function (options) {
    var self = this;
    this.setData({
      courseId: options.courseId,
      pageName: options.courseName,
    });
    courseService.getCourseExam(options.courseId, (data) => {
      self.setData({
        questions: data.questions,
        exam: data
      });
    });
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onSubmit: function (params) {
    var self = this;
    var checkboxAnswers = this.data.postQuestions;
    var radioAnswers = this.data.radioAnswers;
    var postQuestions = [...checkboxAnswers, ...radioAnswers];
    if (postQuestions.length > 0) {
      self.setData({
        submit: true,
        isDisable: true
      });
      var data = {
        courseId: this.data.courseId,
        questions: postQuestions
      };

      courseService.postCourseExam(data, (res) => {
        if (res.result == "Failed") {
          self.setData({
            isPass: false
          });
        } else {
          self.setData({
            isPass: true,
            score: res.point
          });
        }

        this.setData({
          show: true,
          submit: false,
          isDisable: false
        });
      });

    } else {
      wx.showToast({
        title: '请先完成答题',
        icon: 'none'
      })
    }
  },
  onCloseTips() {
    wx.navigateBack({
      delta: 1
    })
  },
  onReTest() {
    var self = this;
    self.setData({
      questions: []
    });
    courseService.getCourseExam(self.data.courseId, (data) => {
      self.setData({
        questions: data.questions,
        exam: data,
        postQuestions: [],
        radioAnswers: [],
        showAnswer: false,
        result: []
      });
    });
  },
  onShowAnswer() {
    var self = this;
    this.setData({
      show: false,
      showAnswer: true
    });

    var checkboxAnswers = self.data.postQuestions;
    var radioAnswers = self.data.radioAnswers;
    var questions = self.data.questions;
    var answers = [...checkboxAnswers, ...radioAnswers];
    for (var i = 0; i < questions.length; i++) {
      var question = answers.find(x => x.questionId == questions[i].id);
      var answer = questions[i].answers;
      questions[i].isCollect = true;
      if (question != undefined) {
        for (var j = 0; j < answer.length; j++) {
          if (question.optionIds.indexOf(answer[j].id) == -1) {
            questions[i].isCollect = false;
            break;
          }
        }
      } else {
        questions[i].isCollect = false;
      }
    }

    self.setData({
      questions: questions
    });
  },
  onReturn() {
    this.setData({
      show: false
    });
    wx.navigateBack({
      delta: 1
    })
  },
})