import { atom } from "recoil";

export const isBookSelectedState = atom({
  key: "isBookSelectedState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const isReviewingState = atom({
  key: "isReviewingState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const isSearchOnState = atom({
  key: "isSearchOnState",
  default: false,
});

export const isUploadOnState = atom({
  key: "isUploadOnState",
  default: false,
});

export const bookState = atom({
  key: "bookState",
  default: [],
});

export const reviewState = atom({
  key: "reviewState",
  default: [],
});
