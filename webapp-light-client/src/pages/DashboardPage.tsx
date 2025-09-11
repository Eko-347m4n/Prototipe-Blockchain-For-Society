import React from 'react';
import { BrowserProvider, Contract } from 'ethers';
import AdminPanel from '../components/AdminPanel';
import OfficerPanel from '../components/OfficerPanel';
import CitizenDashboard from '../components/CitizenDashboard';

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
  const { 
    provider, 
    account, 
    userRoles, 
    rbacContract, 
    identityContract, 
    dukcapilContract, 
    pendidikanContract, 
    sosialContract, 
    kesehatanContract 
  } = props;

  if (userRoles.isAdmin) return <AdminPanel provider={provider} rbacContract={rbacContract} />;
  if (userRoles.isDukcapil) return <OfficerPanel provider={provider} contract={dukcapilContract} title="Dukcapil Officer Panel" actionName="updateCitizenData" fieldName="NIK" />;
  if (userRoles.isPendidikan) return <OfficerPanel provider={provider} contract={pendidikanContract} title="Pendidikan Officer Panel" actionName="updateAcademicRecord" fieldName="Student ID" />;
  if (userRoles.isSosial) return <OfficerPanel provider={provider} contract={sosialContract} title="Sosial Officer Panel" actionName="recordAidDistribution" fieldName="Beneficiary ID" />;
  if (userRoles.isKesehatan) return <OfficerPanel provider={provider} contract={kesehatanContract} title="Kesehatan Officer Panel" actionName="recordBPJSValidation" fieldName="BPJS ID" />;
  
  return <CitizenDashboard provider={provider} identityContract={identityContract} userAddress={account} dukcapilContract={dukcapilContract} />;
};

export default DashboardPage;
