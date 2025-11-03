import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl" role="alert">
      <p className="font-bold mb-1">Ein Fehler ist aufgetreten</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;