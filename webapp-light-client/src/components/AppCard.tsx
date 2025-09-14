import React from 'react';

const AppCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="card mb-4">
    <div className="card-header">
      <h5 className="my-0">{title}</h5>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export default AppCard;
