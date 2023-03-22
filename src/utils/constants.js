import Config from "react-native-config";

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

export const listTheme = [
    THEME_LIGHT,
    THEME_DARK
]

export const LANGUAGE_EN = 'en';
export const LANGUAGE_VI = 'vi';

export const listLanguage = [
    LANGUAGE_EN,
    LANGUAGE_VI
]


export const USER_TYPE_FACEBOOK = 'facebook';
export const USER_TYPE_GOOGLE = 'google';
export const USER_TYPE_LOCAL = 'local';

export const KEY_STORAGE_THEME = 'theme';
export const KEY_STORAGE_LANGUAGE = 'language';
export const KEY_STORAGE_USER = 'user';
export const KEY_STORAGE_LAST_SYNC_DATE = 'lastSyncDate';
export const KEY_STORAGE_LAST_CHANGE_DB_GROUP = 'lastChangeDBGroup';
export const KEY_STORAGE_LAST_CHANGE_DB_TASK = 'lastChangeDBTask';
export const KEY_STORAGE_LAST_CHANGE_DB_DAILY = 'lastChangeDBDaily';
export const KEY_STORAGE_LAST_CHANGE_DB_NOTE = 'lastChangeDBNote';

export const FIREBASE_ROOT_GROUP = 'groups';
export const FIREBASE_ROOT_TASK = 'tasks';
export const FIREBASE_ROOT_DAILY = 'daily';
export const FIREBASE_ROOT_NOTE = 'note';
export const FIREBASE_ROOT_LOGIN = 'login';

export const GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID;
export const ROUTE_GROUP = 'Group';
export const ROUTE_TASK = 'Task';
export const ROUTE_DAILY = 'Daily';
export const ROUTE_PROFILE = 'Profile';

export const DATABASE_GROUP = 'dbGroup_1';
export const DATABASE_TASK = 'dbTask_1';
export const DATABASE_DAILY = 'dbDaily_1';
export const DATABASE_NOTE = 'dbNote_1';

export const TIME_SYNC_MIN = 0.25;
