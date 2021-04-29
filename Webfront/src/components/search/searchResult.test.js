import { TvTwoTone } from "@material-ui/icons";
import React, { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Router } from "react-router";
import SearchResult from "./searchResult";
import { createMemoryHistory } from "history";

describe("UserProfile", () => {
  let container = null;
  beforeEach(() => {
    container = document.createElement("div");
    container.setAttribute("id", "app");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("render with no result", () => {
    const history = createMemoryHistory();
    const container = document.getElementById("app");
    act(() => {
      render(
        <Router history={history}>
          <SearchResult />
        </Router>,
        container
      );
    });

    expect(container.querySelector("p")).toHaveTextContent(
      "نتیجه‌ای برای نمایش وجود ندارد"
    );
  });

  it("render with result", () => {
    const history = createMemoryHistory();
    const container = document.getElementById("app");
    container.doctor={name:"q",city:"ww"}
    act(() => {
      render(
        <Router history={history}>
          <SearchResult />
        </Router>,
        container
      );
    });
    expect(container.querySelector("p")).toHaveTextContent(
        "نتیجه‌ای برای نمایش وجود ندارد"
      );  });

});
