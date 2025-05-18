import { render, screen } from '@testing-library/react';
import FormHeader from '@/components/common/form/FormHeader';

describe('FormHeader', () => {
  it('renders the given title in an h2 element', () => {
    render(<FormHeader title="Register Account" />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Register Account');
  });
});
