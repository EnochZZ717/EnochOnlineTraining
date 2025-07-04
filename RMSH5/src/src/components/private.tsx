
import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorPage } from '../pages/error-page';
import Home from '../pages/home';
import HomeSearch from '../pages/home/home-search'
import AzureLessons from '../pages/azure-lessons';
import OperationGuide from '../pages/operation-guide';
import ExamDetail from '../pages/operation-guide/exam-detail';
import StudyGroups from '../pages/study-groups';
import PersonalCenter from '../pages/personal-center';
import LessonDetail from '../pages/azure-lessons/lesson-detail';
import { LoginWrapper } from './login-wrapper';
import { USER_PROFILE } from '../models/common/sys-msg';
import Collection from '../pages/personal-center/collection';
import History from '../pages/personal-center/history';
import Courses from '../pages/personal-center/courses';
import PersonalInfo from '../pages/login/register';
import StudyGroupAdd from '../pages/study-groups/study-group-add';
import StudyGroupEdit from '../pages/study-groups/study-group-edit';
import StudyGroupCourseStatus from '../pages/study-groups/study-group-course-status';
import StudyGroupMember from '../pages/study-groups/study-group-member';

export function Private(): ReactElement {
  const user = JSON.parse(sessionStorage.getItem(USER_PROFILE) ?? '{}');
  return (
    <>
    <Routes>
        <Route path="/" element={<LoginWrapper currentUser={user} children={<Home/>} isHome={true}/>}/>
        <Route path="/home" element={<LoginWrapper currentUser={user} children={<Home/>} isHome={true}/>}/>
        <Route path="/home/search" element={<LoginWrapper currentUser={user} children={<HomeSearch/>}/>}/>
        <Route path="/azureLessons" element={<LoginWrapper currentUser={user} children={<AzureLessons/>}/>}/>
        <Route path="/azureLessons/search" element={<LoginWrapper currentUser={user} children={<HomeSearch/>}/>}/>
        <Route path="/azureLessons/:id" element={<LoginWrapper currentUser={user} children={<LessonDetail/>}/>}/>
        <Route path="/operationGuide" element={<LoginWrapper currentUser={user} children={<OperationGuide/>}/>}/>
        <Route path="/operationGuide/search" element={<LoginWrapper currentUser={user} children={<HomeSearch/>}/>}/>
        <Route path="/operationGuide/:id" element={<LoginWrapper currentUser={user} children={<LessonDetail/>}/>}/>
        <Route path="/operationGuide/:id/exam" element={<LoginWrapper currentUser={user} children={<ExamDetail/>}/>}/>
        <Route path="/studyGroups" element={<LoginWrapper currentUser={user} children={<StudyGroups/>}/>}/>
        <Route path="/studyGroups/add" element={<LoginWrapper currentUser={user} children={<StudyGroupAdd/>}/>}/>
        <Route path="/studyGroups/edit" element={<LoginWrapper currentUser={user} children={<StudyGroupEdit/>}/>}/>
        <Route path="/studyGroups/courseStatus" element={<LoginWrapper currentUser={user} children={<StudyGroupCourseStatus/>}/>}/>
        <Route path="/studyGroups/update" element={<LoginWrapper currentUser={user} children={<StudyGroupAdd/>}/>}/>
        <Route path="/studyGroups/courseStatus/member" element={<LoginWrapper currentUser={user} children={<StudyGroupMember/>}/>}/>
        <Route path="/personalCenter" element={<LoginWrapper currentUser={user} children={<PersonalCenter/>}/>}/>
        <Route path="/personalCenter/info" element={<LoginWrapper currentUser={user} children={<PersonalInfo/>}/>}/>
        <Route path="/personalCenter/collection" element={<LoginWrapper currentUser={user} children={<Collection/>}/>}/>
        <Route path="/personalCenter/history" element={<LoginWrapper currentUser={user} children={<History/>}/>}/>
        <Route path="/personalCenter/courses" element={<LoginWrapper currentUser={user} children={<Courses/>}/>}/>
        <Route path="*" element={<LoginWrapper currentUser={user} children={<ErrorPage code={404} />}/>}/>
    </Routes>
    </>
  );
}
