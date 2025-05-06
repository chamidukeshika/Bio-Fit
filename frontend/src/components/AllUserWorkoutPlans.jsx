import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Row, Col } from 'react-bootstrap'
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Link } from 'react-router-dom';




const AllUserWorkoutPlans = (props) => {

 

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/workoutPlans/${props.userId}`);
            setData(response.data._embedded.workoutPlanList);
            console.log(response.data._embedded.workoutPlanList);
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>

            {isLoading ? (<>
                <div style={{ margin: '20% 0% 0% 50%' }}>

                    <CircularProgress />

                </div>

            </>) : (

                <>
                    <div>
                        {data && data.length>0 ? (
                        <>{data && data.map((row) => (
                            <Link to={`/WorkoutPlanPostView/${row.id}`}>
                                <Col style={{ float: 'left', padding: '2% 0% 2% 2%' }}>
                                    <Card sx={{ maxWidth: 345, minWidth: 345 }} >
                                        <CardMedia
                                            sx={{ height: 200, Width: 325 }}
                                            image={row.image}

                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" style={{ height: '50px' }}>
                                                {row.name}
                                            </Typography>
                                            <p>{row.intensity}&nbsp;&nbsp;&nbsp;&nbsp;{row.duration} min</p>
                                        </CardContent>
                                    </Card>
                                </Col>
                            </Link>
                        ))}</>
                        ):(
                        <>
                        <p>No data</p>
                        </>)}
                        

                    </div>
                </>)}
        </>

    )
}

export default AllUserWorkoutPlans;