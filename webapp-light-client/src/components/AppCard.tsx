import React from 'react';

const AppCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="card mb-4 shadow-sm">
    <div className="card-header">
      <h4 className="my-0 fw-normal">{title}</h4>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export default AppCard;
