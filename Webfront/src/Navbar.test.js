import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import App from "./App";
import React from "react";
import { Link, Router } from "react-router-dom";
import { createMemoryHistory } from "history";

const renderWithRouter = (component) => {
    const history = createMemoryHistory();
    return {
      ...render(<Router history={history}>{component}</Router>),
    };
  };
  

it("should navigate to the searchResult", () => {
    const { container, getByTestId } = renderWithRouter(<App />);
    fireEvent.click(getByTestId("goToSearch"));
    const router = getByTestId("router");
    const searchResult = getByTestId("searchResult");
    const navbar = getByTestId("navbar");
  
    expect(router).toContainElement(searchResult);
    expect(router).toContainElement(navbar);
  });
  
it("should navigate to the login on redirecttoprofile", () => {
    const { container, getByTestId } = renderWithRouter(<App />);
    fireEvent.click(getByTestId("redirecttoprofile"));
    const router = getByTestId("router");
    const searchResult = getByTestId("login");
  
    expect(router).toContainElement(searchResult);
  });
  