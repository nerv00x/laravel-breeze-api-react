import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import useAuthContext from '../hooks/useAuthContext';
import Spinner from '../components/ui/Spinner';

export default function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const { register, errors, loading } = useAuthContext();

    const handleRegister = async (e) => {
        e.preventDefault();
        register({ name, email, password, password_confirmation });
    };

    return (
        <div className="flex justify-center items-start" style={{ height: '100vh', marginTop: '50px' }}>
            <div className="p-card p-p-6 p-shadow-6" style={{ width: '400px' }}>
                <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Create a new account</h2>
                <form onSubmit={handleRegister}>
                    <div className="p-field">
                        <label htmlFor="name" className="text-sm font-medium leading-6 text-gray-900 block text-center">Name</label>
                        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1" inputStyle={{ backgroundColor: '#D6A2E8', borderRadius: '5px', padding: '0.5rem', textAlign: 'center' }} />
                        {errors.name && <small className="p-error">{errors.name[0]}</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="email" className="text-sm font-medium leading-6 text-gray-900 block text-center">Email address</label>
                        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1" inputStyle={{ backgroundColor: '#D6A2E8', borderRadius: '5px', padding: '0.5rem', textAlign: 'center' }} />
                        {errors.email && <small className="p-error">{errors.email[0]}</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="password" className="text-sm font-medium leading-6 text-gray-900 block text-center">Password</label>
                        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1" inputStyle={{ backgroundColor: '#D6A2E8', borderRadius: '5px', padding: '0.5rem', textAlign: 'center' }} />
                        {errors.password && <small className="p-error">{errors.password[0]}</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="password_confirmation" className="text-sm font-medium leading-6 text-gray-900 block text-center">Confirm Password</label>
                        <InputText id="password_confirmation" type="password" value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full mt-1" inputStyle={{ backgroundColor: '#D6A2E8', borderRadius: '5px', padding: '0.5rem', textAlign: 'center' }} />
                    </div>

                    <div className="p-field" style={{ marginTop: '1rem' }}>
                        <Button type="submit" className="w-full" label="Submit" disabled={loading} style={{ backgroundColor: '#D6A2E8' }}>
                            <Spinner loading={loading} />
                        </Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to={'/login'} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
