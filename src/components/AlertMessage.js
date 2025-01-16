// src/components/AlertMessage.js
import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({ variant, message, onClose }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000); // Cierra la alerta después de 5 segundos
      return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }
  }, [onClose]);

  if (!message) return null;

  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};

export default AlertMessage;
