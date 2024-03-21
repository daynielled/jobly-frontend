import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from './SignupForm';

// Mocking useHistory hook
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('SignupForm', () => {
  it('renders without crashing', () => {
    render(<SignupForm />);
  });

  it('updates form data on input change', () => {
    const { getByLabelText } = render(<SignupForm />);
    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });

    expect(getByLabelText('Username').value).toBe('testuser');
    expect(getByLabelText('Password').value).toBe('testpassword');
    expect(getByLabelText('First name').value).toBe('John');
    expect(getByLabelText('Last name').value).toBe('Doe');
    expect(getByLabelText('Email').value).toBe('test@example.com');
  });

  it('submits form data and redirects on successful signup', async () => {
    const mockSignup = jest.fn().mockResolvedValue({ success: true });
    const { getByText, getByLabelText } = render(<SignupForm signup={mockSignup} />);

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpassword',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      });
      expect(mockSignup).toHaveBeenCalledTimes(1);
      expect(window.location.pathname).toBe('/companies');
    });
  });

  it('displays error message on unsuccessful signup', async () => {
    const mockSignup = jest.fn().mockResolvedValue({ success: false, errors: ['Invalid username'] });
    const { getByText, getByLabelText } = render(<SignupForm signup={mockSignup} />);

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Invalid username')).toBeInTheDocument();
    });
  });
});
