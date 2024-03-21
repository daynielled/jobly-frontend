import React from "react";
import { render, waitFor } from "@testing-library/react";
import App, { TOKEN_STORAGE_ID } from "./App";
import UserContext from "./auth/UserContext";
import JoblyApi from "./api/api";
import jwt from "jsonwebtoken";

it("renders without crashing", function() {
  render(<App />);
});

// Mocking JoblyApi module
jest.mock("./api/api");

describe("App component", () => {
  it("renders loading spinner while loading user info", async () => {
    // Mocking token stored in localStorage
    localStorage.setItem(TOKEN_STORAGE_ID, "testToken");

    // Mocking the decoded token
    const decodedToken = { username: "testuser" };
    jwt.decode = jest.fn(() => decodedToken);

    // Mocking getCurrentUser method
    JoblyApi.getCurrentUser = jest.fn(() => Promise.resolve({ username: "testuser" }));

    const { getByTestId } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(getByTestId("loading-spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(getByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("renders Navigation and Routes components after loading user info", async () => {
    // Mocking token stored in localStorage
    localStorage.setItem(TOKEN_STORAGE_ID, "testToken");

    // Mocking the decoded token
    const decodedToken = { username: "testuser" };
    jwt.decode = jest.fn(() => decodedToken);

    // Mocking getCurrentUser method
    JoblyApi.getCurrentUser = jest.fn(() => Promise.resolve({ username: "testuser" }));

    const { getByTestId } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getByTestId("navigation")).toBeInTheDocument();
      expect(getByTestId("routes")).toBeInTheDocument();
    });
  });

  // Add more tests for signup, login, logout functions, and context provider value
});