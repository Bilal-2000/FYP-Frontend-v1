import React, { useEffect, useState } from 'react'
import useAxiosPrivate from './components/register/hooks/useAxiosPrivate'
import Cookies from 'universal-cookie';
import Header from './components/homecomponents/header';
const cookies = new Cookies();
const Records = () => {
    const axiosPrivate = useAxiosPrivate();
    const [results, setResults] = useState([]);
    useEffect(() => {
        axiosPrivate.get("model/predict/results/",
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('access')}`
                },
                withCredentials: true
            }
        ).then(res => {
            console.log(res.data)
            setResults(res.data)
        })
    }, [])
    return (
        <>
            <Header />
            <section id="hero" className="d-flex align-items-center">
                <div className="container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">name</th>
                                <th scope="col">image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results?.map((elem, index) => {
                                return (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{elem?.prediction_result}</td>
                                        <td><img src={`http://127.0.0.1:8000${elem?.thumbnail}`} alt='' /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default Records