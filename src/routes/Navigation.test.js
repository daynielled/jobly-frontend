import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navigation from "./Navigation";
import { UserProvider } from "../testUtils";

it("renders without crashing", function () {
  render(
      <MemoryRouter>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </MemoryRouter>,
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider currentUser={null}>
          <Navigation />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders correct links for logged in user", () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </MemoryRouter>
    );

    expect(getByText("Companies")).toBeInTheDocument();
    expect(getByText("Jobs")).toBeInTheDocument();
    expect(getByText("Profile")).toBeInTheDocument();
    expect(getByText("Log out")).toBeInTheDocument();
  });

  it("renders correct links for logged out user", () => {
    const { getByText } = render(
      <MemoryRouter>
        <UserProvider currentUser={null}>
          <Navigation />
        </UserProvider>
      </MemoryRouter>
    );

    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Sign Up")).toBeInTheDocument();
  });

  it("calls logout function when logout link is clicked", () => {
    const logout = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <UserProvider>
          <Navigation logout={logout} />
        </UserProvider>
      </MemoryRouter>
    );

    fireEvent.click(getByText("Log out"));
    expect(logout).toHaveBeenCalledTimes(1);
  });
