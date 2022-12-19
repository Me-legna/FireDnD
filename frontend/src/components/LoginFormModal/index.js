// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();

          if (data && data.message) setErrors([data.message]);
          if (data && data.errors) setErrors(Object.values(data.errors));
        }
      );
  };

  return (
    <div className="modal-form">
      <div className="modal-header">
        <h1>Log In</h1>
      </div>
      <div className="modal-body-container">
          <form className="modal-body" onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label className="modal-label">
            <input
              className="modal-top-input"
              type="text"
              value={credential}
              maxLength={50}
              placeholder={'Username or Email'}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label className="modal-label">
            <input
              className="modal-bottom-input"
              type="password"
              value={password}
              maxLength={50}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="submit clickable" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormModal;
