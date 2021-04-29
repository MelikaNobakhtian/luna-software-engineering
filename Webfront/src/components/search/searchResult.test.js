import { TvTwoTone } from "@material-ui/icons";
import React, { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Router } from "react-router";
import searchResult from "./searchResult";
import SearchResult from "./searchResult";

describe("UserProfile", () => {
  let container = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("render with no result", () => {

    expect(container.doctor).toBe();
  });
  it("render with result", () => {
      
    expect(container.doctor).toBe();
  });
  it("render with result2", () => {
      
    expect(container.doctor).toBe();
  });
});
