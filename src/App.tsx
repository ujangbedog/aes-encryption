import React, { useState } from 'react';
import * as CryptoJS from 'crypto-js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [input, setInput] = useState<string>('');
  const [decryptInput, setDecryptInput] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [iv, setIV] = useState<string>('');
  const [mode, setMode] = useState<'ECB' | 'CBC'>('ECB');
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const validateInputs = (): boolean => {
    if (!secretKey || secretKey.length > 32) {
      setErrorMessage('Secret Key must not exceed 32 characters.');
      return false;
    }
    if (mode === 'CBC' && (iv.length !== 16)) {
      setErrorMessage('Initialization Vector must be 16 characters long for CBC mode.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleEncrypt = () => {
    if (!validateInputs()) return;

    const encryptionMode = mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC;
    const encrypted = CryptoJS.AES.encrypt(input, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: encryptionMode,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(iv)
    });
    setEncryptedData(encrypted.toString());
  };

  const handleDecrypt = () => {
    if (!validateInputs()) return;

    const decryptionMode = mode === 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC;
    const decrypted = CryptoJS.AES.decrypt(decryptInput, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: decryptionMode,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(iv)
    });
    setDecryptedData(decrypted.toString(CryptoJS.enc.Utf8));
  };

  const handleCopy = (data: string | null) => {
    if (data) {
      const textArea = document.createElement("textarea");
      textArea.value = data;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(null), 1500);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Simple Encryption & Decryption using AES (mode ECB and CBC) with React.js Typescript</h2>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 col-lg-6">
          <label className="form-label">Encryption Mode:</label>
          <select className="form-control mb-3" value={mode} onChange={(e) => setMode(e.target.value as 'ECB' | 'CBC')}>
            <option value="ECB">ECB</option>
            <option value="CBC">CBC</option>
          </select>
          {mode === 'CBC' && (
            <div className="mb-3">
              <label className="form-label">Initialization Vector (16 characters):</label>
              <input className="form-control" value={iv} onChange={(e) => setIV(e.target.value)} maxLength={16} />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Secret Key (up to 32 characters):</label>
            <input className="form-control" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} maxLength={32} />
            {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
          </div>
        </div>
      </div>
      <div className="row">
        {/* Encryption Section (Left Side) */}
        <div className="col-md-6">
          <h4 className="mb-3">Encryption</h4>
          <div className="mb-3">
            <label className="form-label">Input String:</label>
            <input className="form-control" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleEncrypt}>Encrypt</button>
          {encryptedData && (
            <div className="mt-4">
              <h5>Encrypted Data:</h5>
              <div className="input-group">
                <input className="form-control" value={encryptedData} disabled />
                <button className="btn btn-secondary" onClick={() => handleCopy(encryptedData)}>Copy</button>
              </div>
              {copyMessage && <div className="text-success mt-2">{copyMessage}</div>}
            </div>
          )}
        </div>

        {/* Decryption Section (Right Side) */}
        <div className="col-md-6">
          <h4 className="mb-3">Decryption</h4>
          <div className="mb-3">
            <label className="form-label">Input for Decryption:</label>
            <input className="form-control" value={decryptInput} onChange={(e) => setDecryptInput(e.target.value)} />
          </div>
          <button className="btn btn-secondary" onClick={handleDecrypt}>Decrypt</button>
          {decryptedData && (
            <div className="mt-4">
              <h5>Decrypted Data:</h5>
              <div className="input-group">
                <input className="form-control" value={decryptedData} disabled />
                <button className="btn btn-secondary" onClick={() => handleCopy(decryptedData)}>Copy</button>
              </div>
              {copyMessage && <div className="text-success mt-2">{copyMessage}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
