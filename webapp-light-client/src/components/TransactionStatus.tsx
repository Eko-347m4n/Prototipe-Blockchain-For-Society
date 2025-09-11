import React from 'react';

const TransactionStatus = ({ status }: { status: string }) => {
  if (!status) return null;
  const isError = status.startsWith('Error');
  return (
    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-3`}>
      {status}
    </div>
  );
};

export default TransactionStatus;
