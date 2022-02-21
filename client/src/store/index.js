import { createStore } from "redux";

function breadcrumbReducer(state = "sss", action) {
  switch (action.type) {
    case "CHANGE":
      return action.payload;
    default:
      return "";
  }
}

let store = createStore(breadcrumbReducer);

export { store };
