import React from "react";
import { render } from "@testing-library/react";
import SearchForm from "./SearchForm";

it("matches snapshot", function () {
  const { asFragment } = render(<SearchForm />);
  expect(asFragment()).toMatchSnapshot();
});


describe('SearchForm', () => {
    it('renders search form correctly', () => {
      const { getByPlaceholderText, getByText } = render(<SearchForm />);
  
      expect(getByPlaceholderText('Enter search term..')).toBeInTheDocument();
      expect(getByText('Submit')).toBeInTheDocument();
    });
  
    it('calls searchFor function with trimmed search term on form submission', () => {
      const searchFor = jest.fn();
      const { getByPlaceholderText, getByText } = render(<SearchForm searchFor={searchFor} />);
  
      const input = getByPlaceholderText('Enter search term..');
      const submitButton = getByText('Submit');
  
      fireEvent.change(input, { target: { value: '  test  ' } });
      fireEvent.click(submitButton);
  
      expect(searchFor).toHaveBeenCalledWith('test');
    });
  
    it('calls searchFor function with undefined when search term is empty on form submission', () => {
      const searchFor = jest.fn();
      const { getByText } = render(<SearchForm searchFor={searchFor} />);
  
      const submitButton = getByText('Submit');
  
      fireEvent.click(submitButton);
  
      expect(searchFor).toHaveBeenCalledWith(undefined);
    });
  
    it('updates search term state on input change', () => {
      const { getByPlaceholderText } = render(<SearchForm />);
  
      const input = getByPlaceholderText('Enter search term..');
  
      fireEvent.change(input, { target: { value: 'test' } });
  
      expect(input.value).toBe('test');
    });
  });