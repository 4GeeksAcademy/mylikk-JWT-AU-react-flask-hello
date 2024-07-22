import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrivateData = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(process.env.BACKEND_URL+'/api/private', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage(data.message);
                } else {
                    throw new Error(data.msg || 'Failed to fetch private data');
                }
            } catch (error) {
                console.error('Error:', error);
                navigate('/login');
            }
        };

        fetchPrivateData();
    }, [navigate]);

    return (
        <div>
            <h2>Private Page</h2>
            <p>{message}</p>
        </div>
    );
};
