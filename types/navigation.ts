/**
 * Navigation type definitions for Expo Router
 */

export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)': undefined;
  scan: undefined;
  listen: undefined;
  results: undefined;
  'shabad/[id]': { id: string };
  'collection/[id]': { id: string };
  onboarding: undefined;
  modal: undefined;
};

export type TabParamList = {
  index: undefined;
  search: undefined;
  saved: undefined;
  profile: undefined;
};

export type AuthParamList = {
  login: undefined;
  signup: undefined;
  'forgot-password': undefined;
};

