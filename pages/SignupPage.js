import { useState } from "react";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName:yup.string().required('L name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8,"Must be at least 8 characters").required('Password is required'),
    confirmPassword:yup.string().oneOf([yup.ref('password'),null],'Passwords must match').required('Confirm password is required')
})

export default function LoginPage(){
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver:yupResolver(schema)
    });
    async function handleLogin(data){
        try{
            const response = await axios.post('/api/login',data)
            console.log(response.data)
        }catch(error){
            setError(error.response.data.message);
        }
    }

    return(
        <form onSubmit={handleSubmit(handleLogin)}>
            {error && <div>{error}</div>}
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email"{...register('email')}/>
                {errors.email && <div>{errors.email.message}</div>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password"{...register('password')}/>
                {errors.password && <div>{errors.password.message}</div>}
            </div>
            <button type="submit" disabled={isSubmitting}>
                Login
            </button>
        </form>
    )

}