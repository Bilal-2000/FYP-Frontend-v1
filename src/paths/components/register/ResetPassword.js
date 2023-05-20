import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import OvalLoader from '../../../utils/Oval';
import { axiosPrivate } from '../../../api/axios';
import Spinner from 'react-bootstrap/Spinner';
import { Button } from 'react-bootstrap';
const password_REGEX = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/;

const ResetPassword = () => {
    const { token, id } = useParams();
    const [validated] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [errMsg, setErrMsg] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false)
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    useEffect(() => {
        setValidPassword(password_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])
    const handleSignup = () => {
        setErrMsg('')
        setShowAlert(false)
        setShowLoader(true)
        let body = {
            password: password,
        }
        axiosPrivate.put(`account/user/reset-password/${id}/${token}/`, body)
            .then(res => {
                setShowAlert(true)
                setShowLoader(false)
                setShowSignIn(true)
            }).catch(err => {
                setShowLoader(false)
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else if (err.response?.status === 400) {
                    setErrMsg("You have already used this link to reset your password. Request again to reset.");
                }
                console.log(errMsg, 'errMcg')
            })
    }
    return (
        <>
            <div className="mt-5 p-lg-5 p-md-5 p-4" >
                <div className="row">
                    <div className="col-xl-5 col-lg-6 col-md-8 col-12 mx-auto shadow p-lg-5 p-md-5 py-5 px-3 sign-form rounded" style={{ backgroundColor: "#171717" }}>
                        <Form className='text-center' noValidate validated={validated}>
                            <div className={errMsg ? "alert alert-danger alert-dismissible fade show" : "offscreen"}>
                                {errMsg}
                                <Button type="button" className={errMsg ? "btn-close" : "d-none"} onClick={() => setErrMsg('')}></Button>
                            </div>
                            <div className={showAlert ? "alert alert-success alert-dismissible fade show" : "offscreen"}>
                                {showAlert && <>Password reset successfully. Please <Link to={"/SignIn"} >
                                    Login
                                </Link> with new password.</>}
                                <button type="button" className={showAlert ? "btn-close" : "d-none"} onClick={() => setShowAlert('')}></button>
                            </div>
                            <h4 className='mb-4'>Reset Password</h4>
                            <Form.Group className="mb-4">
                                <Form.Control
                                    type="password"
                                    id="typePasswordX"
                                    className="form-control mb-3"
                                    placeholder="Password"
                                    autoComplete="on"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    aria-invalid={validPassword ? "false" : "true"}
                                    aria-describedby="pwdnote"
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(false)}
                                />
                                <p
                                    id="pwdnote"
                                    style={{ color: "#E86669", fontSize: "14px" }}
                                    className={passwordFocus && password && !validPassword ? "instructions" : "visually-hidden"}>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#E86669" }} />
                                    &nbsp;8 to 24 characters.Must include uppercase or lowercase letters and a number.
                                </p>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Control
                                    type="password"
                                    id="confirm_password"
                                    className="form-control mb-3"
                                    value={matchPassword}
                                    autoComplete="on"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setMatchPassword(e.target.value)}
                                    required
                                    aria-invalid={validPassword ? "false" : "true"}
                                    aria-describedby="confirmnote"
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                />
                                <p
                                    id="confirmnote"
                                    style={{ color: "#E86669", fontSize: "14px" }}
                                    className={matchFocus && !validMatch ? "instructions" : "visually-hidden"}>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#E86669" }} />
                                    &nbsp;Must match the first password input field.
                                </p>
                            </Form.Group>
                            <div className='text-center'>
                                <div>
                                    <button
                                        type="button"
                                        disabled={!validPassword || !validMatch || showLoader ? true : false}
                                        onClick={handleSignup}
                                        className="btn btn-next  px-5">
                                        {showLoader ? <Spinner style={{ width: "1.4rem", height: "1.4rem" }} /> : "Change Password"}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ResetPassword;