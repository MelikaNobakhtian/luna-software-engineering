import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import React from "react";
import { Link, Router } from "react-router-dom";
import { createMemoryHistory } from "history";

test("renders learn react link", () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});

// it('should take a snapshot', () => {
//   const { asFragment } = render(<App />)

//   expect(asFragment(<App />)).toMatchSnapshot()
//  })

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return {
    ...render(<Router history={history}>{component}</Router>),
  };
};

it("should render the navbar", () => {
  const { container, getByTestId } = renderWithRouter(<App />);
  const navbar = getByTestId("navbar");
  const router = getByTestId("router");
  //const searchResult = getByTestId("searchResult");
  const home = getByTestId("home");

  //expect(container.innerHTML).toMatch("Home page");
  expect(router).toContainElement(navbar);
});

it("should render the home page", () => {
  const { container, getByTestId } = renderWithRouter(<App />);
  const router = getByTestId("router");
  const home = getByTestId("home");

  expect(router).toContainElement(home);
});

it("should navigate to the searchResult", () => {
  const { container, getByTestId } = renderWithRouter(<App />);
  fireEvent.click(getByTestId("goToSearch"));
  const router = getByTestId("router");
  const searchResult = getByTestId("searchResult");
  const navbar = getByTestId("navbar");

  expect(router).toContainElement(searchResult);
  expect(router).toContainElement(navbar);
});


