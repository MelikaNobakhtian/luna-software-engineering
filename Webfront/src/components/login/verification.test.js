import { TvTwoTone } from "@material-ui/icons";
import React, { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import Verification from "./verification";

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

  it("token is taken", () => {
    const history = createMemoryHistory();
    const container = document.getElementById("app");
    act(() => {
      render(
        <Router history={history}>
          <Verification tokenId="11111" />
        </Router>,
        container
      );
    });
  });
});
