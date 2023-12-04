// Pet.jsx
import React, { useEffect, useState } from 'react';
import getCookie from '../../../hooks/getCookie';
import useAuthCheck from '../../../hooks/useAuthCheck';

const Pet = () => {
    const [petData, setPetData] = useState(null);
    const currentDate = new Date();
    const petDate= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;


    const fetchPetData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/pet/get-pet/?pet_date=${petDate}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch exercise data');
            }

            const data = await response.json();
            console.log(data)
            setPetData(data);
        } catch (error) {
            console.error('Error fetching pet data:', error);
        }
    }

    const getPetImage = () => {
        if (petData && petData.grow) {
            switch (petData.grow) {
                case 'Adult':
                    return `/pets/Adult-${petData.body_status}.png`
                    
                case 'Child':
                case 'Child2':
                    switch (petData.body_status){
                        case "Semi-Fatting":
                            return `/pets/${petData.grow}-Fatting.png`
                        case "Semi-Thin":
                            return `/pets/${petData.grow}-Thin.png`
                        case "Semi-Muscular":
                            return `/pets/${petData.grow}-Muscular.png`
                        default:
                            return `/pets/${petData.grow}-${petData.body_status}`
                    }
                default:
                    return `/pets/${petData.grow}.png`;
            }
        }
        return '/pets/Egg.png';
    };

    useAuthCheck(fetchPetData)

    return (
        <div>
        <h1>Pet Information</h1>
        {petData ? (
            <div>
                <p>Grow: {petData.grow}</p>
                <p>Status: {petData.body_status}</p>
            </div>
        ) : (
            <p>Loading pet data...</p>
        )}
        <img src={getPetImage()} width={300}></img>
        </div>
    );
};

export default Pet;
