import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../storage/userSlice";
import Input from "../Components/Input";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  const [loginOrRegister, setLoginOrRegister] = useState("login");
  const [erorrMessage, setErorrMessage] = useState("");

  //form vars
  const [usernameEmail, setUsernameEmail] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) navigate("/home");
  }, []);

  const loginRequest = async () => {
    if (!usernameEmail || !password) {
      setErorrMessage("No all required data");
      return;
    }

    try {
      const response = await axios.post("/auth/login", {
        usernameEmail: usernameEmail,
        password: password,
      });

      setErorrMessage("");

      dispatch(setToken(response.data));
      navigate("/home");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setErorrMessage("Invalid username/email");
        }
        if (err.response.status === 401) {
          setErorrMessage("Invalid password");
        }
      }
    }
  };

  const registerRequest = async () => {
    if (!username || !password || !email) {
      setErorrMessage("No all required data");
      return;
    }

    try {
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
      });

      setErorrMessage("");

      dispatch(setToken(response.data));
      navigate("/home");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setErorrMessage("User with this username or email alreay exists");
        }
        if (err.response.status === 401) {
          setErorrMessage("Invalid password");
        }
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-200 flex justify-center items-center text-black">
      <div className="bg-white w-[30rem] h-[30rem] p-10 border-2 rounded-lg min-h-fit">
        <h1 className="text-2xl text-center">
          {loginOrRegister === "login" ? "Login" : "Register"}
        </h1>
        <div className="mt-6">
          {loginOrRegister === "login" ? (
            <Input
              text="email / username"
              className="my-4"
              onChange={(e) => {
                setUsernameEmail(e.target.value);
              }}
              value={usernameEmail}
            />
          ) : (
            <div>
              <Input
                text="username"
                className="my-4"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
              />
              <Input
                text="email"
                className="my-4"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>
          )}
          <Input
            text="password"
            className="my-4"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <p className="text-red-600">{erorrMessage}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full my-4"
            onClick={
              loginOrRegister === "login" ? loginRequest : registerRequest
            }
          >
            {loginOrRegister === "login" ? "Login" : "Register"}
          </button>

          <h2
            className="mt-1 hover:underline cursor-pointer"
            onClick={() => {
              setLoginOrRegister(
                loginOrRegister === "login" ? "register" : "login"
              );
            }}
          >
            {loginOrRegister === "login"
              ? "Don't Have an Account?"
              : "Already a user?"}
          </h2>
        </div>
      </div>
    </div>
  );
}
