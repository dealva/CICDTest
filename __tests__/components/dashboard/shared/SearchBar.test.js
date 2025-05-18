// __tests__/components/common/SearchBar.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/dashboard/shared/SearchBar';

describe('SearchBar', () => {
  it('renders the input with correct placeholder and value', () => {
    render(<SearchBar searchTerm="Test" handleChange={() => {}} />);
    const input = screen.getByPlaceholderText('Search here');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Test');
  });

  it('calls handleChange when input changes', () => {
    const handleChangeMock = jest.fn();
    render(<SearchBar searchTerm="" handleChange={handleChangeMock} />);

    const input = screen.getByPlaceholderText('Search here');
    fireEvent.change(input, { target: { value: 'New value' } });

    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });
});
