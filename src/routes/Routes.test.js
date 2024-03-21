import React from "react";
import { render. waitFor } from "@testing-library/react";
import Routes from "./Routes";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";

it("renders without crashing", function () {
  render(
      <MemoryRouter>
        <UserProvider>
          <Routes />
        </UserProvider>
      </MemoryRouter>,
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <Routes />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

// Mock components
jest.mock('../homepage/Homepage', () => () => <div data-testid="homepage">Homepage</div>);
jest.mock('../companies/CompanyList', () => () => <div data-testid="company-list">CompanyList</div>);
jest.mock('../jobs/JobList', () => () => <div data-testid="job-list">JobList</div>);
jest.mock('../companies/CompanyDetail', () => () => <div data-testid="company-detail">CompanyDetail</div>);
jest.mock('../auth/LoginForm', () => () => <div data-testid="login-form">LoginForm</div>);
jest.mock('../profiles/ProfileForm', () => () => <div data-testid="profile-form">ProfileForm</div>);
jest.mock('../auth/SignupForm', () => () => <div data-testid="signup-form">SignupForm</div>);
jest.mock('./PrivateRoute', () => ({ children }) => <div>{children}</div>);

describe('Routes', () => {
  it('renders homepage for / route', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByTestId('homepage')).toBeInTheDocument();
    });
  });

  it('renders login form for /login route', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getByTestId('login-form')).toBeInTheDocument();
    });
  });

  // Add more tests for other routes...
});