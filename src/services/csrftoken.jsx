import React from "react";
import { getCookie } from "./auth";
let csrftoken = getCookie("csrftoken");

export function CSRFToken() {
  return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
}

export default CSRFToken;
