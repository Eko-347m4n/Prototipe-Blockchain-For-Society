import React from 'react';
import { BrowserProvider, Contract } from 'ethers';
import CitizenDashboard from '../components/CitizenDashboard';
import OfficerDashboard from '../components/OfficerDashboard';

interface DashboardPageProps {
  provider: BrowserProvider;
  account: string;
  userRoles: { isAdmin: boolean; isDukcapil: boolean; isPendidikan: boolean; isSosial: boolean; isKesehatan: boolean; };
  rbacContract?: Contract;
  identityContract?: Contract;
  dukcapilContract?: Contract;
  pendidikanContract?: Contract;
  sosialContract?: Contract;
  kesehatanContract?: Contract;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { userRoles, account, identityContract } = props;

  const isOfficer = userRoles.isAdmin || userRoles.isDukcapil || userRoles.isPendidikan || userRoles.isSosial || userRoles.isKesehatan;

  if (isOfficer) {
    return <OfficerDashboard {...props} />;
  }
  
  return <CitizenDashboard 
            provider={props.provider} 
            identityContract={identityContract} 
            userAddress={account} 
            dukcapilContract={props.dukcapilContract}
            pendidikanContract={props.pendidikanContract}
            sosialContract={props.sosialContract}
            kesehatanContract={props.kesehatanContract}
          />;
};

export default DashboardPage;
