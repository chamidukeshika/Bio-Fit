import React, { useState } from 'react'
import axios from 'axios';
import { Row, Col } from 'react-bootstrap'
import TextField from '@mui/material/TextField';
import WorkoutPalnTempStyle from '../styles/WorkoutPalnTempStyle.module.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import NavBar from '../components/NavBar';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';



import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { storage } from "../Config/FireBaseConfig.js";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from 'react-router-dom';

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
};

const WorkoutPlanTemplate = () => {

    const [isLoading, setIsLoading] = useState(false);
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [Exercise, setExerciseTableData] = useState([
        {
            name: '',
            description: '',
            targetAreas: '',
            equipments: '',
            sets: '',
            reps: '',

        }
    ]);
    const [duration, setDuration] = useState('');
    const [intensity, setIntensity] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);


    //handlers in exercise table
    const handleAddRowExercise = () => {
        setExerciseTableData((prevData) => [
            ...prevData,
            {
                name: '',
                description: '',
                targetAreas: '',
                equipments: '',
                sets: '',
                reps: '',

            },
        ]);
    };

    const handleRemoveExercise = (index) => {
        setExerciseTableData((prevData) => {
            const newData = [...prevData];
            newData.splice(index, 1);
            return newData;
        });
    };

    const handleInputChangeExercise = (index, field, value) => {
        setExerciseTableData((prevData) => {
            const newData = [...prevData];
            newData[index][field] = value;
            return newData;
        });
    };

    //handler for image preview
    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);

        // Preview the selected image
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(selectedImage);
    };

    //video
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setVideo(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'video/*', multiple: false });


    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    //image upload handler
    const uploadProfileImage = async () => {
        return new Promise((resolve, reject) => {
            if (image == null) {
                resolve(null); // Resolve with null if no image is provided
            } else {
                const ProfileImageRef = ref(
                    storage,
                    `${storedUserInfo.userName} / WorkoutPlan / ${image.name + v4()}`
                );

                uploadBytes(ProfileImageRef, image)
                    .then(() => {
                        getDownloadURL(ProfileImageRef)
                            .then((downloadURL) => {

                                resolve(downloadURL);
                            })
                            .catch((error) => {
                                // Error getting download URL
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        // Error uploading image
                        reject(error);
                    });
            }
        })
    }

    //video upload handler
    const uploadVideo = async () => {
        return new Promise((resolve, reject) => {
            if (video == null) {
                resolve(null); // Resolve with null if no image is provided
            } else {
                const ProfileImageRef = ref(
                    storage,
                    `${storedUserInfo.userName} / WorkoutPlan / ${video.name + v4()}`
                );

                uploadBytes(ProfileImageRef, video)
                    .then(() => {
                        getDownloadURL(ProfileImageRef)
                            .then((downloadURL) => {
                                alert('added to firebase')
                                resolve(downloadURL);
                            })
                            .catch((error) => {
                                // Error getting download URL
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        // Error uploading image
                        reject(error);
                    });
            }
        })
    }



    const submitHandler = async () => {

        if ((name == '') || (description == '') || (duration === '') || (intensity === '')) {
            toast.error("Fill required fields");
        } else {

            setIsLoading(true);

            const downUrl = await uploadProfileImage();
            const downVideoUrl = await uploadVideo();

            const WorkoutPlan = {
                name: name,
                description: description,
                exercises: Exercise,
                duration: duration,
                intensity: intensity,
                image: downUrl,
                video: downVideoUrl,
                creatorId: storedUserInfo.id,
                creatorName: storedUserInfo.userName,
            };

            console.log(WorkoutPlan);

            axios.post('http://localhost:8080/api/workoutPlans', WorkoutPlan)
                .then(response => {
                    console.log("Workout Plan published successfully!" + response);
                    toast.success("Workout Plan published successfully!")
                    navigate('/myprofile')
                    setIsLoading(false)
                })
                .catch(error => {
                    console.error("Error:", error);
                });

        }

    }



    return (
        <>
            <NavBar />

            {isLoading ? (
                <>
                    <div style={{ margin: '20% 0% 0% 50%' }}>

                        <CircularProgress />

                    </div>
                </>
            ) : (
                <>
                    <div className={WorkoutPalnTempStyle.bodyDiv} >

                        <div style={{ backgroundColor: "rgb(106 1 102)", marginRight: '15%' }}>
                            <h2 className={WorkoutPalnTempStyle.header} >NEW WORKOUT PLAN</h2>
                        </div>

                        <div style={{ backgroundColor: "#ffffff", padding: '3%', marginRight: '15%' }}>

                            <Row>
                                <Col xs={6}>
                                    <Row className={WorkoutPalnTempStyle.rows}>

                                        <TextField
                                            id="outlined-basic"
                                            label="WorkOut Name"
                                            placeholder="Name for your Workout Plan"
                                            variant="outlined"
                                            value={name}
                                            required
                                            onChange={(e) => setName(e.target.value)}
                                        />

                                    </Row>

                                    <Row className={WorkoutPalnTempStyle.rows}>
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            label="Description"
                                            placeholder="Small description about your workout"
                                            multiline
                                            fullWidth
                                            required
                                            variant="outlined"
                                            rows={6}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />

                                    </Row>

                                </Col>

                                <Col>

                                    <Row className={WorkoutPalnTempStyle.rows} style={{ height: '93%' }}>
                                        <Row style={{ paddingLeft: '15%' }}>
                                            <form>
                                                <label >
                                                    <div style={{ textAlign: 'center' }}>
                                                        {imagePreview ? (
                                                            <img src={imagePreview} alt="Preview" style={{ width: '325px', height: '200px', margin: '0% 0px 0px 13%' }} />
                                                        ) : (
                                                            <img src={'/src/assets/images/image-ico.jpg'} alt="Preview" style={{ width: '325px', height: '200px', margin: '0% 0px 0px 13%' }} />
                                                        )}
                                                    </div>

                                                </label>
                                            </form>
                                        </Row>
                                        <Row style={{ paddingLeft: '44%', width: '360px', paddingTop: '2%' }}>
                                            <Button
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                                onChange={handleImageChange}
                                            >
                                                Upload file
                                                <VisuallyHiddenInput type="file" />
                                            </Button>
                                        </Row>



                                    </Row>
                                </Col>

                            </Row>

                            <Row style={{ paddingBottom: '2%', color: '#8e9ea6' }}>
                                <h4>Exercises</h4>
                            </Row>

                            <Row className={WorkoutPalnTempStyle.rows} style={{ paddingBottom: '0%' }}>
                                <TableContainer component={Paper} style={{ padding: '0%' }} >
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Name</TableCell>
                                                <TableCell align="left">Description</TableCell>
                                                <TableCell align="left">Traget Areas</TableCell>
                                                <TableCell align="left">Equipments</TableCell>
                                                <TableCell align="left">Sets</TableCell>
                                                <TableCell align="left">Repetitons</TableCell>
                                                <TableCell align="left">Remove</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Exercise.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.name}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            multiline
                                                            minRows={1}
                                                            value={row.description}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "description",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.targetAreas}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "targetAreas",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.equipments}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "equipments",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.sets}
                                                            type='number'
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "sets",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            type='number'
                                                            value={row.reps}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "reps",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button style={{
                                                            color: '#6a0166',
                                                            borderColor: '#6a0166', width: '25%',
                                                            marginBottom: '3%',
                                                            marginTop: '3%'
                                                        }} variant="outlined" onClick={() => handleRemoveExercise(index)}>Remove</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Row>
                            <Row className={WorkoutPalnTempStyle.rows}>
                                <Button variant="contained" style={{ backgroundColor: '#6a0166' }} fullWidth onClick={handleAddRowExercise}>Add Rows</Button>

                            </Row>



                            <Row>


                                {video && (
                                    <div>
                                        <p>Preview:</p>
                                        <ReactPlayer url={URL.createObjectURL(video)} controls />
                                    </div>
                                )}

                                <div {...getRootProps()} style={dropzoneStyle}>
                                    <input {...getInputProps()} />
                                    <p>Drag & drop a video file here, or click to select one</p>
                                </div>


                            </Row>


                            <Row className={WorkoutPalnTempStyle.rows}>
                                <Col xs={6}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" required>Intensity</FormLabel>
                                        <RadioGroup

                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={intensity}
                                            onClick={(e) => setIntensity(e.target.value)}


                                        >
                                            <FormControlLabel value="Beginner" control={<Radio />} label="Beginner" />
                                            <FormControlLabel value="Intermediate" control={<Radio />} label="Intermediate" />
                                            <FormControlLabel value="Advanced" control={<Radio />} label="Advanced" />

                                        </RadioGroup>
                                    </FormControl>
                                </Col>


                                <Col>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password" required>Duration</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={duration}
                                            type='number'
                                            onChange={(e) => setDuration(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    min
                                                </InputAdornment>
                                            }
                                            label="Duration"
                                        />
                                    </FormControl>
                                </Col>

                            </Row>

                            <Row>

                                <Button style={{ backgroundColor: '#6a0166', width: '15%', marginLeft: '41%' }} variant="contained" onClick={submitHandler}>Publish</Button>
                            </Row>

                        </div>



                    </div>
                </>
            )}


        </>

    )
}

export default WorkoutPlanTemplate
