export const baseUrl = `${process.env.REACT_APP_BASE_BACKEND_API}/api`

// home
export const HOME = `${baseUrl}/home`
export const HOME_SEARCH = `${baseUrl}/course/deepsearch`

// azure lessons
export const COURSE_PUBLIC = `${baseUrl}/course/public`
export const CATEGORY_PUBLIC = `${baseUrl}/category/public`
export const COURSE_DETAIL = `${baseUrl}/course`

// operation guide
export const CATEGORY_OPERATION = `${baseUrl}/category/operation`
export const COURSE_OPERATION = `${baseUrl}/course/operation`

// exam
export const COURSE_EXAM = `${baseUrl}/paper/course`
export const EXAM_RESULT = `${baseUrl}/examresult`

// video
export const VIDEO_TOKEN = `${baseUrl}/video/h5`

// login
export const GET_TOKEN = `${baseUrl}/login/Token`
export const REGISTER = `${baseUrl}/User`
export const GET_TOKEN_BY_PHONENUMBER = `${baseUrl}/login/Token/PhoneNumber`

// System config
export const INDUSTRIES = `${baseUrl}/SystemConfig/Industries`
export const SAMPLE_TYPES = `${baseUrl}/SystemConfig/GetSampleTypes`
export const PROVINCE = `${baseUrl}/SystemConfig/Provinces`
export const TAG_CONFIG = `${baseUrl}/SystemConfig/TagConfig`
export const COURSE_CATEGORY_CONFIG = `${baseUrl}/SystemConfig/CourseCategoryConfig`
export const BUSSINESS_TYPE = `${baseUrl}/SystemConfig/BussinessType`
export const GUIDE_VIDEO = `${baseUrl}/SystemConfig/GuideVideos`
export const GROUP_IMAGE = `${baseUrl}/SystemConfig/GroupImages`
export const QUICK_SEARCH_CONFIG = `${baseUrl}/SystemConfig/QuickSearchConfig`

// collection
export const COURSE_COLLECTION = `${baseUrl}/Collection`
export const COLLECTIONS = `${baseUrl}/Collections`

// history
export const HISTORY = `${baseUrl}/BroadcastHistory`
export const HISTORY_LOG = `${baseUrl}/BroadcastHistory/Log`

// completed courses
export const COMPLETED_COURSES = `${baseUrl}/User/course/completed`
export const WATCH_COMPLETED_COURSES = `${baseUrl}/User/course/watchcompleted`

// member group
export const MEMBER_GROUPS = `${baseUrl}/MemberGroups`
export const GROUP_MANAGED_COURSE = `${baseUrl}/MemberGroup/GroupManagedCourse`
export const MEMBER_GROUP = `${baseUrl}/MemberGroup`
export const MEMBER_GROUP_DETAIL = `${baseUrl}/MemberGroup/Detail`

// user
export const SERIES_NUMBER_EXIST = `${baseUrl}/User/SeriesNumber/Exsit`
export const USER_SERIES_NUMBER = `${baseUrl}/User/SeriesNumber`
export const USER_IMAGE = `${baseUrl}/User/images`