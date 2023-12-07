import React, { useState } from 'react';
import Navigation from '../Navigation';

const SignUp = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        passwordAgain: '',
        picture: null,
        sex: 0,
        birthday: '',
    });
    const [successMes,setSuccessMes]=useState('')
    const [errorMes,setErrorMes] =useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(userData.name=='' || userData.email==''||userData.birthday==''){
            setErrorMes('fill the form.')
            return 
        }
        if (userData.password !== userData.passwordAgain) {
            console.log("Passwords do not match");
            setErrorMes("Passwords do not match");
            return;
        }
        if (userData.password.length <6){
            console.log("Input more than 6 words as password.");
            setErrorMes("Input more than 6 words as password.")
            return;
        }
        try {
            const dataToSend = {
                ...userData,
                username: userData.email // emailをusernameに自動割り当て
            };

            const response = await fetch('http://127.0.0.1:8000/accounts/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                // リクエストが成功した場合
                const data = await response.json();
                console.log(data);
                setErrorMes('')
                setSuccessMes('We sent the link to your email. Please check and activate your account. Your account is not available yet.');
            }else{
                // リクエストが失敗した場合
                const data = await response.json();
                console.log(data);
                setErrorMes(' email is already registered.')
            }

        } catch (error) {
            console.error('Error:', error);
            // エラーハンドリング
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className='container'>
            <div className='sub-container'>
                <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                    
                    <div className="drawer open-nav">
                        <h1 className="text-5xl font-bold">SignUp!</h1>
                            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">
                                <label htmlFor="my-drawer" className="btn btn-circle swap swap-rotate drawer-button">
                                    {/* this hidden checkbox controls the state */}
                                    <input type="checkbox" />
                                    <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                                    <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                                </label>
                            </div> 
                            <div className="drawer-side">
                                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                                <Navigation />
                            </div>
                        </div>
                    </div>
                    <div className=" shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            name="name"
                            className="input input-bordered" 
                            value={userData.name}
                            onChange={handleChange}
                            required 
                        />
                        
                        </div>

                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            name="email"
                            className="input input-bordered" 
                            value={userData.email}
                            onChange={handleChange}
                            required 
                        />
                        </div>

                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            name='password'
                            className="input input-bordered" 
                            value={userData.password}
                            onChange={handleChange}
                            required 
                        />
                        </div>
                        <div className="form-control">
                        <input 
                            type="password" 
                            placeholder="Re-entaer Password" 
                            name="passwordAgain"
                            className="input input-bordered" 
                            value={userData.passwordAgain}
                            onChange={handleChange}
                            required 
                        />
                        </div>

                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Birthday</span>
                        </label>
                        <input 
                            type="date" 
                            name="birthday" 
                            value={userData.birthday} 
                            onChange={handleChange} 
                        />             
                        </div>


                        <div className="signup-sex">
                            <label>
                                Male
                                <input
                                    type="radio"
                                    value={0}
                                    checked={userData.sex === 0}
                                    onChange={(e) => setUserData({ ...userData, sex: parseInt(e.target.value) })}
                                />
                            </label>
                            <label>
                                Female
                                <input
                                    type="radio"
                                    value={1}
                                    checked={userData.sex === 1}
                                    onChange={(e) => setUserData({ ...userData, sex: parseInt(e.target.value) })}
                                />
                            </label>
                        </div>

                        <label className="label">
                            {/* <NavLink className="label-text-alt link link-hover" to="/password-reset/request">Forgot password?</NavLink> */}
                        </label>
                        

                        <div className="form-control mt-6">
                            <button type='submit'className="btn btn-primary">SignUp</button>
                        </div>
                        {errorMes ==='' ?(
                            <></>
                        ):(
                            <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{errorMes}</span>
                            </div>
                        )}

                        {successMes ==='' ?(
                            <></>
                        ):(
                            <div role="alert" className="alert alert-success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{successMes}</span>
                            </div>
                        )}
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>

    );
};

export default SignUp;
