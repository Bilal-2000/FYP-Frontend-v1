import { useRef, useState, useEffect, } from "react";
import axios from "../../../api/axios";
import Cookies from 'universal-cookie';
import useAuth from "./hooks/useAuth";
import "./signin.css"
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
const cookies = new Cookies()
const REGISTER_URL = 'account/register/';
const LOGIN_URL = 'account/user/login/'
const SignIn = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/";
    const [login, setLogin] = useState(true)
    const [loader, setLoader] = useState(false)
    const [emailForLogin, setEmailForLogin] = useState('')
    const [passwordForLogin, setPasswordForLogin] = useState('');
    const [username, setUsername] = useState('')
    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');

    // useEffect(() => {
    //     emailRef.current.focus();
    // }, [])




    useEffect(() => {
        setErrMsg('');
    }, [email, password,])
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL, {
                email,
                password,
                username
            },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUsername('');
            setEmail('');
            setPassword('');
            setLogin(true)
        } catch (err) {
            setLoader(false)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response?.data.Error);
            } else {
                err.response?.data?.detail?.phoneNo ?
                    setErrMsg(err.response?.data?.detail?.phoneNo) :
                    setErrMsg(err.response?.data?.detail?.email)
            }
            errRef.current.focus();
        }
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoader(true);
        let token
        try {
            const response = await axios.post(
                LOGIN_URL, { email: emailForLogin, password: passwordForLogin },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                }
            )
            const accessToken = response?.data?.access;
            localStorage.setItem("access", JSON.stringify(response?.data?.access));
            window.localStorage.setItem("isLoggedIn", "true")
            // localStorage.setItem("name", "abdul");
            cookies.set('access', response?.data?.access);
            cookies.set('refresh', response?.data?.refresh);
            // const roles = response?.data?.roles;
            setAuth({ email, password, accessToken });
            setEmail('');
            setPassword('');
            setLoader(false)
            navigate(from, { replace: true });
        } catch (err) {
            setLoader(false)
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Username or password incorrect');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    return (
        <div className="body-2">
            <section className="user">
                <div className={login ? "container-1" : "container-1 right-panel-active"} id="container-1">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-container sign-up-container">
                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <h1>Create Account</h1>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        name={username}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        placeholder="Email"
                                        name={email}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        name={password}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button onClick={(e) => handleSubmit(e)}>Sign Up</button>
                                </form>
                            </div>
                            <div className="form-container sign-in-container">
                                <form onSubmit={(e) => handleLogin(e)}>
                                    <h1>Sign in</h1>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        email={emailForLogin}
                                        value={emailForLogin}
                                        onChange={(e) => setEmailForLogin(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        name={passwordForLogin}
                                        value={passwordForLogin}
                                        onChange={(e) => setPasswordForLogin(e.target.value)}
                                        required />
                                    <Link to="/Forgot">Forgot your password?</Link>
                                    <button onClick={(e) => handleLogin(e)}>Sign In</button>
                                </form>
                            </div>
                            <div className="overlay-container">
                                <div className="overlay">
                                    <div className="overlay-panel overlay-left">
                                        <h1>Already have a account?</h1>
                                        <p>To keep using this website please login with your personal info</p>
                                        <button className="ghost" id="signIn" onClick={() => setLogin(true)}>Sign In</button>
                                    </div>
                                    <div className="overlay-panel overlay-right">
                                        <h1>New Here?</h1>
                                        <p>Don't Worry! Enter your personal details and start journey with us</p>
                                        <button className="ghost" id="signUp" onClick={() => setLogin(false)}>Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default SignIn