import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import getCookie from '../helpers/getCookie';


const ExerciseCreate = ({workoutType,exercise_date}) => {
    const navigate=useNavigate()
    // const { date } = useParams();
    const [workouts,setWorkouts]= useState([])
    const [default_workouts,setDefaultWorkouts]= useState([])
    const [formData, setFormData] = useState({
        workout_id: '',
        exercise_date: exercise_date,

        sets: null,
        reps: null,
        weight_kg: null,

        duration_minutes: null,
        distance: null,
        mets: null,
        memos: null
    });

    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        }else{
            fetchWorkouts()
        }
    }, []);

    useEffect(()=>{
        console.log(formData.workout_id)
    },[formData])



    // fetch workouts and use in form.
    const fetchWorkouts = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/exercise/get-workout/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setWorkouts(data.workout);
            setDefaultWorkouts(data.default_workout)
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    };


    // post exercise
    const handleCreateExercise = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/exercise/post-exercise/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken') ,
                },
                body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log('Exercise created successfully:', data);
        // 成功時の処理を追加

        } catch (error) {
            console.error('Error creating exercise:', error);
        ;
        } 
    };



    // detect change of form.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name,value)


        // If the value is an empty string, set it to null
        if(name === 'workout_id'){
            const sanitizedValue = parseInt(value) ? parseInt(value) : value;
            setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            
        }else{
            const sanitizedValue = value === '' ? null : value;
            if (name !== 'date') {
                setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
        }
    };



    
    return (
        <div>
            <h2>Create Exercise</h2>
            <h3>{formData.date}</h3>

            <label>
                Workout ID:
                <select
                    name='workout_id'
                    value={formData.workout_id === null ? '' : formData.workout_id}
                    onChange={handleInputChange}
                >
                    <option value='' disabled>Select a workout</option>
                    {workouts
                    .filter((workout)=>workout.workout_type===workoutType)
                    .map((workout) => (
                        <div><option key={workout.id} value={workout.id}>
                        {workout.name}
                    </option>
                    <p>{workout.workout_type}</p></div>
                        
                    ))}
                    {default_workouts
                    .filter((workout)=>workout.workout_type===workoutType)
                    .map((workout) => (
                        <option key={workout.id} value={workout.id}>
                            {workout.name}
                        </option>
                    ))}
                </select>
            </label>


        {workoutType === 'Aerobic' ? (
            <>
                <label>
                    Distance:
                    <input
                        name='distance'
                        type="number"
                        value={formData.distance === null ? '' : formData.distance}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Duration (minutes):
                    <input
                        name="duration_minutes"
                        type="number"
                        value={formData.duration_minutes === null ? '' : formData.duration_minutes}
                        onChange={handleInputChange}
                    />
                </label>
            </>
        ) : (
            <>
                <label>
                    Sets:
                    <input
                        name='sets'
                        type="number"
                        value={formData.sets === null ? '' : formData.sets}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Reps:
                    <input
                        name='reps'
                        type="number"
                        value={formData.reps === null ? '' : formData.reps}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Weight (kg):
                    <input
                        name='weight_kg'
                        type="number"
                        value={formData.weight_kg === null ? '' : formData.weight_kg}
                        onChange={handleInputChange}
                    />
                </label>
            </>
        )}

            {/* <label>
                Sets:
                <input 
                name='sets'
                type="number" 
                value={formData.sets ===null?'':formData.sets} 
                onChange={handleInputChange} />
            </label>

            <label>
                Reps:
                <input 
                name='reps'
                type="number" 
                value={formData.reps ===null?'':formData.reps} 
                onChange={handleInputChange} />
            </label>

            <label>
                Weight (kg):
                <input 
                name='weight_kg'
                type="number" 
                value={formData.weight_kg ===null?'':formData.weight_kg} 
                onChange={handleInputChange} />
            </label>

            <label>
                Duration (minutes):
                <input 
                name="duration_minutes"
                type="number" 
                value={formData.duration_minutes ===null?'':formData.duration_minutes} 
                onChange={handleInputChange} />
            </label>

            <label>
                Distance:
                <input 
                name='distance'
                type="number" 
                value={formData.distance ===null?'':formData.distance} 
                onChange={handleInputChange} />
            </label> */}

            <label>
                METs:
                <input 
                name='mets'
                type="number" 
                value={formData.mets ===null?'':formData.mets} 
                onChange={handleInputChange} />
            </label>

            <label>
                Memos:
                <textarea 
                name='memos'
                value={formData.memos ===null?'':formData.memos} 
                onChange={handleInputChange} />
            </label>

            <button onClick={handleCreateExercise} >
                Create
            </button>

        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
        </div>
    );
};

export default ExerciseCreate;
