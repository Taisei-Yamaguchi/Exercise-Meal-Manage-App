import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import getCookie from '../hooks/getCookie';
import useAuthCheck from '../hooks/useAuthCheck';
// import { authToken } from '../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../settings';

import { useDispatch } from 'react-redux';
import { setToastMes } from '../redux/store/ToastSlice';
import { setToastClass } from '../redux/store/ToastSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';


const SettingsAccount = () => {
    const toastMes = useSelector((state)=>state.toast.toastMes)
    const toastClass = useSelector((state)=>state.toast.toastClass)
    const dispatch =useDispatch()

    const [name, setName] = useState('');
    const [picture, setPicture] = useState(null);
    const [sex, setSex] = useState(false);
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [mes,setMes]=useState('')
    

    const fetchAccount = async () => {
        try {
            dispatch(setToastMes(''))
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/accounts/get/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            });
            const data = await response.json();

            console.log(data); // サーバーからのレスポンスをログ出力
            setName(data.name);
            setPicture(data.picture);
            setSex(data.sex);
            setBirthday(data.birthday);
            setEmail(data.email_address)
            
        } catch (error) {
            console.error('Error:', error);
            // エラーハンドリング
        }
    };

    useAuthCheck(fetchAccount)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/accounts/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ name, picture, sex, birthday }),
            });

            const data = await response.json();
            if(response.ok){
                console.log('User Account saved successfully:', data);
                fetchAccount()

                dispatch(setToastMes('Update Success!'))
                dispatch(setToastClass('alert-info'))
            }else{
                dispatch(setToastMes('Error!'))
                dispatch(setToastClass('alert-error'))
            }
            console.log(data); // サーバーからのレスポンスをログ出力
            
            setMes('Update Success')
        } catch (error) {
            console.error('Error:', error);
            dispatch(setToastMes('Error!'))
            dispatch(setToastClass('alert-error'))
        }
    };

    
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'picture':
                // 画像の処理を実装
                setPicture(e.target.value);
                break;
            case 'sex':
                // setSex(e.target.checked);
                setSex(e.target.value === 'true');
                break;
            case 'birthday':
                setBirthday(e.target.value);
                break;
            default:
                break;
        }
    };



    return (
        <div className='container'>
            <div className='sub-container'>
                <div className="hero min-h-screen ">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                    
                    <div className="drawer open-nav">
                        <h1 className="text-5xl font-bold">Setting</h1>
                            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">
                                <label htmlFor="my-drawer" className="bg-gradient-to-r from-stone-400 to-transparentbtn btn btn-circle swap swap-rotate drawer-button">
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
                            value={name}
                            onChange={handleChange}
                            required
                            pattern="\S+" // スペース以外の文字が1文字以上必要
                            title="スペースのみの入力は無効です"
                        />
                        </div>

                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <p className="input input-bordered" > 
                            {email}
                        </p>
                        </div>

                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Birthday</span>
                        </label>
                        <input 
                            type="date" 
                            name="birthday" 
                            value={birthday} 
                            onChange={handleChange} 
                        />             
                        </div>


                        <div className="signup-sex">
                            <label>
                                Male
                                <input
                                    type="radio"
                                    name='sex'
                                    value={false}
                                    checked={sex === false}
                                    onChange={handleChange}
                                    />
                            </label>
                            <label>
                                Female
                                <input
                                    type="radio"
                                    name='sex'
                                    value={true}
                                    checked={sex === true}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        {toastMes && toastMes !==''&&(
                            <div role="alert" className={`alert ${toastClass}`} >
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{toastMes}</span>
                            </div>
                        )}
                        
                        <div className="form-control mt-6">
                            <button type='submit'className="btn btn-primary">Account Update</button>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsAccount;
