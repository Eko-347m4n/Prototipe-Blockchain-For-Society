import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from './DashboardPage';

// Mock the child dashboards
vi.mock('../components/OfficerDashboard', () => ({
  default: (props) => <div data-testid="officer-dashboard">Officer Dashboard</div>,
}));

vi.mock('../components/CitizenDashboard', () => ({
  default: (props) => <div data-testid="citizen-dashboard">Citizen Dashboard</div>,
}));

describe('DashboardPage', () => {
  const mockProps = {
    provider: {} as any,
    account: '0x123',
    identityContract: {} as any,
    dukcapilContract: {} as any,
    pendidikanContract: {} as any,
    sosialContract: {} as any,
    kesehatanContract: {} as any,
  };

  it('should render OfficerDashboard if user has an officer role', () => {
    const officerRoles = {
      isAdmin: true,
      isDukcapil: false,
      isPendidikan: false,
      isSosial: false,
      isKesehatan: false,
    };

    render(<DashboardPage {...mockProps} userRoles={officerRoles} />);

    expect(screen.getByTestId('officer-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('citizen-dashboard')).not.toBeInTheDocument();
  });

  it('should render CitizenDashboard if user is not an officer', () => {
    const citizenRoles = {
      isAdmin: false,
      isDukcapil: false,
      isPendidikan: false,
      isSosial: false,
      isKesehatan: false,
    };

    render(<DashboardPage {...mockProps} userRoles={citizenRoles} />);

    expect(screen.getByTestId('citizen-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('officer-dashboard')).not.toBeInTheDocument();
  });
});
