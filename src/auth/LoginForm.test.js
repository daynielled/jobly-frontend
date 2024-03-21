import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { MemoryRouter, useHistory } from "react-router-dom";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));


it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

describe('LoginForm', () => {
  it('renders without crashing', () => {
    render(<LoginForm />);
  });

  it('updates form data on input change', () => {
    const { getByLabelText } = render(<LoginForm />);
    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
  
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });
  
  

  it('submits form data and redirects on successful login', async () => {
    const pushMock = jest.fn();
    useHistory.mockReturnValue({ push: pushMock });
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
  
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <LoginForm login={mockLogin} />
      </MemoryRouter>
    );
  
    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
  
    fireEvent.click(getByText('Submit'));
  
    // Wait for the asynchronous operations to complete
    await waitForElement(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpassword',
      });
      expect(pushMock).toHaveBeenCalledWith('/companies');
    });
  });

  it('displays error message on unsuccessful login', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: false, errors: ['Invalid credentials'] });
    const { getByText } = render(
      <MemoryRouter>
        <LoginForm login={mockLogin} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Submit'));

    // Wait for the asynchronous operations to complete
    await waitForElement(() => {
      expect(getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});