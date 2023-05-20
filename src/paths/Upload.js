import React, { useState } from 'react'
import "./home.css"
import Header from './components/homecomponents/header'
import axios from '../api/axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from './components/register/hooks/useAxiosPrivate';
import "./Upload.css"
const cookies = new Cookies()
const Upload = () => {
    const [image, setImage] = useState();
    const [loader, setLoader] = useState(false)
    const [text, setText] = useState('');
    const [Confidence, setConfidence] = useState('')
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const HandleUpload = () => {
        setLoader(true)
        axiosPrivate.post('model/predict/',
            {
                image: image,
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${cookies.get('access')}`
                },
                withCredentials: true
            }
        ).then(res => {
            console.log(res.data, 'data')
            setLoader(false)
            setText(res.data.Prediction)
            setConfidence(res.data.Confidence)
        }).catch(err => {
            setLoader(false)
            if (err.response.status === 400) {
                setText("The User did not fill out all the fields")
            } else {
                setText("Server Error")
            }

        })
    }
    return (
        <>
            <Header />
            <div className="centered-container">
                <div className="centered-content">
                    <h1 className='mb-2'>Upload here</h1>
                    <div className="mb-3">
                        <input id="file-input4" type="file" className="form-control"
                            onChange={(event) => {
                                setImage(event.target.files[0]);
                            }} />
                    </div>
                    <button onClick={HandleUpload} className='modal__button'>Upload</button>
                    {text && <p id ="prediction">{text}</p>}
                    {Confidence && <p id="confidence">Confidence : {Confidence}</p>}
                </div>

            </div>
        </>
    )
}

export default Upload