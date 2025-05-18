// __tests__/components/common/DashboardHeader.test.js

import { render, screen } from '@testing-library/react';
import DashboardHeader from '@/components/dashboard/shared/DashboardHeader';

// Mock the LogoutButton to isolate the component
jest.mock('@/components/common/LogoutButton', () => () => (
  <button>Mock Logout</button>
));

describe('DashboardHeader', () => {
  it('renders the provided title', () => {
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the LogoutButton', () => {
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Mock Logout')).toBeInTheDocument();
  });
});
