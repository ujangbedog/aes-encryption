import React, { useState } from 'react';
import * as CryptoJS from 'crypto-js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [input, setInput] = useState<string>('');
  const [decryptInput, setDecryptInput] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateKey = (): boolean => {
    if (!secretKey || secretKey.length !== 32) {
      setErrorMessage('Secret Key must be 32 characters long.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleEncrypt = () => {
    if (!validateKey()) return;
    const encrypted = CryptoJS.AES.encrypt(input, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    setEncryptedData(encrypted.toString());
  };

  const handleDecrypt = () => {
    if (!validateKey()) return;
    const decrypted = CryptoJS.AES.decrypt(decryptInput, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    setDecryptedData(decrypted.toString(CryptoJS.enc.Utf8));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Simple Encryption & Decryption using AES (ECB Mode, Key Size 256)</h1>
      <div className="row">
        {/* Input Section (Left Side) */}
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Input String:</label>
            <input className="form-control" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Input for Decryption:</label>
            <input className="form-control" value={decryptInput} onChange={(e) => setDecryptInput(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Secret Key (32 characters for 256-bit):</label>
            <input className="form-control" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
            {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
          </div>
          <button className="btn btn-primary me-2" onClick={handleEncrypt}>Encrypt</button>
          <button className="btn btn-secondary" onClick={handleDecrypt}>Decrypt</button>
        </div>

        {/* Result Section (Right Side) */}
        <div className="col-md-6">
          {encryptedData && (
            <div className="mt-4">
              <h3>Encrypted Data:</h3>
              <p>{encryptedData}</p>
            </div>
          )}

          {decryptedData && (
            <div className="mt-4">
              <h3>Decrypted Data:</h3>
              <p>{decryptedData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
