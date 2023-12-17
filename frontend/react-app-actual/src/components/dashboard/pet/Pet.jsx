import React, { useEffect, useState } from 'react';
import getCookie from '../../../helpers/getCookie';

import formattedCurrentDate from '../../../helpers/getToday';
import { BACKEND_ENDPOINT } from '../../../settings';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { setMainLoading } from '../../../redux/store/LoadingSlice';


const Pet = () => {
    const [petData, setPetData] = useState(null);
    const dispatch = useDispatch()
    const mainLoading = useSelector((state) => state.loading.mainLoading);


    // fetch Pet data first render.
    useEffect(()=>{
        fetchPetData()
    },[])


    // fetch pet data.
    const fetchPetData = async () => {
        try {
            dispatch(setMainLoading(true))
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/pet/get-pet/?pet_date=${formattedCurrentDate}`,{
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
            console.log('Success fetchPet!')
            setPetData(data);
        } catch (error) {
            console.error('Error fetching pet data:', error);
        } finally{
            dispatch(setMainLoading(false))
        }
    }


    // get Pet Image Function
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

    
    // render
    return (
        <div>
        {mainLoading ? (
            <span className="loading loading-bars loading-lg"></span>
        ) : (
            <div className="shadow-xl image-full" style={{ backgroundImage: 'url(/pets-bg/brown-grass.jpeg)' }}>
            <div className="card-body">
                <img src={getPetImage()} width={200} alt="Pet" />
            </div>
            </div>
        )}
        </div>
    );
};

export default Pet;
