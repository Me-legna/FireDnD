// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./DemoLogin.css";

function DemoUserLogin() {
  const dispatch = useDispatch();
  const [credential] = useState('Demo-lition');
  const [password] = useState('password');
  // const [errors, setErrors] = useState([]);
  // const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    return dispatch(sessionActions.login({ credential, password }))

    };

  return (
    <>
    <li onClick={handleSubmit}>Easy Access 😏</li>
    </>
  );
}

export default DemoUserLogin;
