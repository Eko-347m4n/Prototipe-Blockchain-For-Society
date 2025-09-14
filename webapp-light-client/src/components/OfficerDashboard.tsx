import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import AdminPanel from './AdminPanel';
import DukcapilOfficerPanel from './DukcapilOfficerPanel';
import PendidikanOfficerPanel from './PendidikanOfficerPanel';
import KesehatanOfficerPanel from './KesehatanOfficerPanel';
import SosialOfficerPanel from './SosialOfficerPanel';

interface OfficerDashboardProps {
  provider: BrowserProvider;
  userRoles: { isAdmin: boolean; isDukcapil: boolean; isPendidikan: boolean; isSosial: boolean; isKesehatan: boolean; };
  rbacContract?: Contract;
  dukcapilContract?: Contract;
  pendidikanContract?: Contract;
  sosialContract?: Contract;
  kesehatanContract?: Contract;
}

type TabKey = 'admin' | 'dukcapil' | 'pendidikan' | 'sosial' | 'kesehatan';

const OfficerDashboard: React.FC<OfficerDashboardProps> = (props) => {
  const { userRoles } = props;

  const availableTabs: { key: TabKey; label: string; show: boolean }[] = [
    { key: 'admin', label: 'Admin', show: userRoles.isAdmin },
    { key: 'dukcapil', label: 'Dukcapil', show: userRoles.isDukcapil },
    { key: 'pendidikan', label: 'Pendidikan', show: userRoles.isPendidikan },
    { key: 'sosial', label: 'Sosial', show: userRoles.isSosial },
    { key: 'kesehatan', label: 'Kesehatan', show: userRoles.isKesehatan },
  ];

  const firstVisibleTab = availableTabs.find(tab => tab.show)?.key || 'admin';
  const [activeTab, setActiveTab] = useState<TabKey>(firstVisibleTab);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminPanel provider={props.provider} rbacContract={props.rbacContract} />;
      case 'dukcapil':
        return <DukcapilOfficerPanel provider={props.provider} dukcapilContract={props.dukcapilContract} />;
      case 'pendidikan':
        return <PendidikanOfficerPanel provider={props.provider} pendidikanContract={props.pendidikanContract} />;
      case 'sosial':
        return <SosialOfficerPanel provider={props.provider} sosialContract={props.sosialContract} />;
      case 'kesehatan':
        return <KesehatanOfficerPanel provider={props.provider} kesehatanContract={props.kesehatanContract} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ul className="nav nav-tabs mb-3">
        {availableTabs.filter(tab => tab.show).map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div>
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default OfficerDashboard;
