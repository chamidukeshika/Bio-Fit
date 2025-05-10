import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col } from 'react-bootstrap'
import TextField from '@mui/material/TextField';
import WorkoutPalnTempStyle from '../styles/WorkoutPalnTempStyle.module.css'
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Check from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';


import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { storage } from "../Config/FireBaseConfig.js";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";


//transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
};


const WorkoutPlanPostView = () => {

    const postId = useParams('id');
    const [postData, setPostData] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const navigate = useNavigate();

    const descriptionElementRef = React.useRef(null);

    //comment box
    const [italic, setItalic] = useState(false);
    const [fontWeight, setFontWeight] = useState('normal');
    const [anchorEl, setAnchorEl] = useState(null);

    //dialog box in deletePost
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [scroll, setScroll] = useState('paper');

    //update dialog box
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
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const [videoPreview, setVideoPreview] = useState(null);
    const [visibility, setVisibility] = useState();

    //like
    const [userLiked, setUserLiked] = useState(false);
    const [openLike, setOpenLike] = useState(false);

    //visibility
    const [visibCount, setvisibCount] = useState(0);

    //add a comment
    const [commentString, setComment] = useState('');
    const [sendComment, setsendComment] = useState(0);

    //delete a comment
    const [deleteComment, setDeleteComment] = useState(0);

    //edit a comment
    const [editCom, setEditCom] = useState(0);
    const [editComement, setEditComment] = useState('');

    //edit Comment dialogBox
    const [openEditComment, setOpenEditComment] = useState(false);

    //video
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setVideo(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'video/*', multiple: false });


    //handlers to handle Edit dialog box
    const handleClickOpenEdit = (scrollType) => () => {
        setOpenEdit(true);
        setScroll(scrollType);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    //handlers to handle delete dialog box
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //handlers to handle viewLikes
    const handleLikeClickOpen = () => {
        setOpenLike(true);
    };

    const handleLikeClickClose = () => {
        setOpenLike(false);
    };

    //handlers to edit Comment Dialog Box
    const handleEditCommentClickOpen = (comment) => {
        setOpenEditComment(true);
        setEditComment(comment);
    };

    const handleEditCommentClose = () => {
        setOpenEditComment(false);
    };


    //handlers for table in edit dialog Box
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

    //image upload function
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

    //table styles
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


    console.log(userLiked);

    const UpdateHandler = async () => {

        const imageUrl = await uploadProfileImage();
        const videoUrl = await uploadVideo();
        if ((name == '') || (description == '') || (duration === '') || (intensity === '')) {
            toast.error("fail to update. Please Fill required fields");
        }
        else {

            const UpdatedWorkoutPlan = {
                name: name,
                description: description,
                exercises: Exercise,
                duration: duration,
                image: imageUrl,
                video: videoUrl,
                intensity: intensity,
                creatorId: storedUserInfo.id,
                creatorName: storedUserInfo.userName
            };

            console.log(UpdatedWorkoutPlan);



            axios.put(`http://localhost:8080/api/workoutPlans/${postId.id}`, UpdatedWorkoutPlan)
                .then(response => {
                    setIsUpdated(true);
                    console.log("Workout Plan updated successfully!" + response);
                    toast.success("Workout Plan updated successfully!");

                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }

        handleCloseEdit()



    }

    const deleteHandler = () => {
        axios.delete(`http://localhost:8080/api/workoutPlans/${postId.id}`)
            .then(response => {
                console.log("Workout Plan deleted successfully!" + response);
                navigate("/myprofile");
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const addCommentHandler = async () => {
        console.log(commentString);
        const commentOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
            comment: commentString,
        }
        console.log(commentOb);
        await axios.put(`http://localhost:8080/api/workoutPlans/comments/${postId.id}`, commentOb)
            .then(response => {
                setsendComment(sendComment => sendComment + 1);
                console.log("Comment updated successfully!" + response);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const deleteCommentHandler = async (name, comment) => {

        const commentOb = {
            name: name,
            comment: comment
        }
        console.log(commentOb);
        await axios.put(`http://localhost:8080/api/workoutPlans/deleteComment/${postId.id}`, commentOb)
            .then(response => {
                setDeleteComment(num => num + 1);
                console.log("Comment deleted successfully!" + response);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const EditCommentHandler = async (name, prevComment, newComment) => {

        const commentOb = {
            name: name,
            prevComment: prevComment,
            newComment: newComment
        }

        console.log(commentOb);
        await axios.put(`http://localhost:8080/api/workoutPlans/editComment/${postId.id}`, commentOb)
            .then(response => {
                setEditCom(prevEditCom => prevEditCom + 1)
                setOpenEditComment(false)
                console.log("Comment deleted successfully!" + response);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const likeHandler = async () => {
        const likeOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/workoutPlans/like/${postId.id}`, likeOb);
            const updatedPost = response.data;
            setPostData(updatedPost);
            setUserLiked(updatedPost.likes.some(like => like.userId === storedUserInfo.id));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UnLikeHandler = async () => {
        const unlikeOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/workoutPlans/unlike/${postId.id}`, unlikeOb);
            const updatedPost = response.data;
            setPostData(updatedPost);
            setUserLiked(updatedPost.likes.some(like => like.userId === storedUserInfo.id));
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const VisibilityHandler = async () => {

        const updatedvisibility = !visibility
        setVisibility(updatedvisibility);

        await axios.put(`http://localhost:8080/api/workoutPlans/visibility/${postId.id}/${updatedvisibility}`)
            .then(response => {
                console.log("change visibility successfully!" + response);
                setvisibCount((count => count + 1));
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }


    //useEffect
    useEffect(() => {
        const fetchDataAndCheckLike = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8080/api/workoutPlans/viewPost/${postId.id}`);
                setPostData(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setDuration(response.data.duration);
                setIntensity(response.data.intensity);
                setVideoPreview(response.data.video);
                setExerciseTableData(response.data.exercises);
                setVisibility(response.data.visibility);


                console.log(response);




                const isLiked = response.data.likes.some(like => like.userId === storedUserInfo.id);
                setUserLiked(isLiked);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchDataAndCheckLike();


        if (openEdit) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [postId.id, sendComment, openEdit, isUpdated, deleteComment, editCom, visibCount])
    console.log(postData);


    console.log(userLiked);
    return (
        <>
            <NavBar />

            {isLoading ? (<>
                <div style={{ margin: '20% 0% 0% 50%' }}>

                    <CircularProgress />

                </div>


            </>)
                : (
                    <>
                        <div className={WorkoutPalnTempStyle.bodyDivPostView} >

                            <div style={{ backgroundColor: "#ffffff", padding: '3%', marginBottom: '10px', maxWidth: '775px' }}>

                                {postData.creatorId === storedUserInfo.id ? (
                                    <>
                                        <Row>
                                            <Col xs={9}></Col>
                                            <Col>
                                                Post
                                                <Switch
                                                    checked={visibility}
                                                    onChange={VisibilityHandler}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                                <span>{visibility ? 'Shared' : 'Private'}</span>
                                            </Col>

                                        </Row>
                                    </>
                                ) : (<></>)}


                                <Row>

                                    <Col xs={5} style={{ paddingLeft: '4%' }}>
                                        <h2 style={{ paddingTop: '10%' }}>
                                            {postData.name}
                                        </h2>
                                        <p style={{ margin: '0%' }}>Posted By : <b style={{ color: '#7960c9' }}>{postData.creatorName}</b></p>
                                        <p style={{ margin: '0%' }}>Intensity : {postData.intensity}</p>
                                        <p style={{ margin: '0%' }}>Hours : {postData.duration} min</p>

                                        <Row>
                                            <Col xs={2}>
                                                {userLiked ? (
                                                    <IconButton onClick={UnLikeHandler}>
                                                        <ThumbUpIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton onClick={likeHandler}>
                                                        <ThumbUpOutlinedIcon />
                                                    </IconButton>
                                                )}
                                            </Col>
                                            <Col>
                                                <Button style={{ color: 'black', background: '#f6f6f6', }} onClick={handleLikeClickOpen}>
                                                    ({postData.likes && postData.likes.length}) likes
                                                </Button>

                                                <React.Fragment style={{ background: '#66526469' }}>
                                                    <Dialog
                                                        style={{ background: '#66526469' }}
                                                        open={openLike}
                                                        onClose={handleLikeClickClose}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"
                                                        fullWidth
                                                        maxWidth='xs'
                                                    >
                                                        <DialogTitle style={{ marginLeft: '40%' }} id="alert-dialog-title">
                                                            {"Likes"}
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <DialogContentText id="alert-dialog-description">
                                                                {postData.likes && postData.likes.map((row) => (
                                                                    <Row style={{ background: '#edebff', margin: '5% 1% -3% 1%' }}>
                                                                        <Col>
                                                                            <p>{row.name}</p>
                                                                        </Col>
                                                                    </Row>
                                                                ))}

                                                            </DialogContentText>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={handleLikeClickClose}>OK</Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </React.Fragment>
                                            </Col>

                                        </Row>

                                        <Row>

                                            {postData.creatorId === storedUserInfo.id ? (<>
                                                <Button style={{
                                                    color: '#077e16',
                                                    borderColor: '#077e16', width: '25%',
                                                    margin: '3% 5% 3% 0%',
                                                    float: 'left'
                                                }}

                                                    variant="outlined"
                                                    onClick={handleClickOpenEdit('paper')}>Edit</Button>


                                                <Button style={{
                                                    color: 'red',
                                                    borderColor: 'red', width: '25%',
                                                    marginBottom: '3%',
                                                    marginTop: '3%'
                                                }}
                                                    variant="outlined"
                                                    onClick={handleClickOpen} >Delete</Button>

                                            </>) : (<></>)}



                                            <React.Fragment>
                                                <Dialog
                                                    open={open}
                                                    TransitionComponent={Transition}
                                                    keepMounted
                                                    onClose={handleClose}
                                                    aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle>{"Do you really want to delete the Workout Plan?"}</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            Are you sure you want to delete the Workout plan? This action cannot be undone. Please confirm your decision.
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose}>Cancel</Button>
                                                        <Button onClick={deleteHandler}>Confirm</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </React.Fragment>
                                        </Row>

                                    </Col>

                                    <Col>
                                        <div >
                                            <img style={{ background: 'rgb(207 202 101)', height: '250px', width: '400px', marginTop: '3%' }} src={postData.image} alt="Preview" />
                                        </div>

                                    </Col>
                                </Row>

                            </div>




                            <div style={{ backgroundColor: "#ffffff", padding: '3%', marginBottom: '10px', maxWidth: '775px' }}>



                                <Row>
                                    <Col>

                                        <Row style={{ paddingBottom: '2%' }}>
                                            <h4>Description</h4>
                                        </Row>
                                        <Row>
                                            <p style={{ color: 'rgb(85 90 93)' }}>
                                                {postData.description}
                                            </p>
                                        </Row>

                                    </Col>
                                </Row>

                                <Row style={{ paddingBottom: '2%' }}>
                                    <h4>Exercises</h4>
                                </Row>
                                {postData.exercises && postData.exercises.map((row) => (
                                    <Row style={{ color: 'rgb(85 90 93)' }}>
                                        <p><b>Name :  </b> {row.name}
                                            <br /><b>Description :  </b>{row.description}
                                            <br /><b>TargetAreas :  </b>{row.targetAreas}
                                            <br /><b>Equipments :  </b> {row.equipments}
                                            <br /><b>Sets :  </b> {row.sets}
                                            <br /><b>Repetions :  </b>{row.reps}
                                        </p>
                                    </Row>
                                ))
                                }

                                <Row>
                                    <div style={{
                                        padding: '3%',
                                        marginBottom: '10px',
                                        maxWidth: '775px',
                                    }}>
                                        <p>Video</p>
                                        <ReactPlayer url={postData.video} controls />
                                    </div>

                                </Row>


                                <Row>
                                    <div style={{
                                        padding: '3%',
                                        marginBottom: '10px',
                                        maxWidth: '775px',
                                        border: '1px solid rgb(185 175 175)'
                                    }}>

                                        <Row style={{ paddingBottom: '2%' }}>
                                            <h4>Comments({postData.comments && postData.comments.length})...</h4>
                                        </Row>
                                        <Row style={{ padding: '0% 5% 0% 5%' }}>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Type something here…"
                                                    minRows={3}
                                                    value={commentString}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    endDecorator={
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                gap: 'var(--Textarea-paddingBlock)',
                                                                pt: 'var(--Textarea-paddingBlock)',
                                                                borderTop: '1px solid',
                                                                borderColor: 'divider',
                                                                flex: 'auto',
                                                            }}
                                                        >
                                                            <IconButton
                                                                variant="plain"
                                                                color="neutral"
                                                                onClick={(event) => setAnchorEl(event.currentTarget)}
                                                            >
                                                                <FormatBold />
                                                                <KeyboardArrowDown fontSize="md" />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl)}
                                                                onClose={() => setAnchorEl(null)}
                                                                size="sm"
                                                                placement="bottom-start"
                                                                sx={{ '--ListItemDecorator-size': '24px' }}
                                                            >
                                                                {['200', 'normal', 'bold'].map((weight) => (
                                                                    <MenuItem
                                                                        key={weight}
                                                                        selected={fontWeight === weight}
                                                                        onClick={() => {
                                                                            setFontWeight(weight);
                                                                            setAnchorEl(null);
                                                                        }}
                                                                        sx={{ fontWeight: weight }}
                                                                    >
                                                                        <ListItemDecorator>
                                                                            {fontWeight === weight && <Check fontSize="sm" />}
                                                                        </ListItemDecorator>
                                                                        {weight === '200' ? 'lighter' : weight}
                                                                    </MenuItem>
                                                                ))}
                                                            </Menu>
                                                            <IconButton
                                                                variant={italic ? 'soft' : 'plain'}
                                                                color={italic ? 'primary' : 'neutral'}
                                                                aria-pressed={italic}
                                                                onClick={() => setItalic((bool) => !bool)}
                                                            >
                                                                <FormatItalic />
                                                            </IconButton>
                                                            <Button sx={{ ml: 'auto' }} onClick={() => addCommentHandler()}>Send</Button>
                                                        </Box>
                                                    }
                                                    sx={{
                                                        minWidth: 300,
                                                        fontWeight,
                                                        fontStyle: italic ? 'italic' : 'initial',
                                                    }}
                                                />
                                            </FormControl>

                                        </Row>

                                        {postData.comments && postData.comments.map((row) => (
                                            <Row style={{
                                                padding: '3%',
                                                margin: '5%',
                                                marginTop: '10px',
                                                marginBottom: '10px',
                                                maxWidth: '775px',
                                                borderRadius: '9px',
                                                boxShadow: '0px 0px 12px 0px rgb(237 230 230)'

                                            }}>

                                                <Row>
                                                    <Col xs={8}> <p style={{ color: '#9d00c2' }}>{row.name}</p></Col>
                                                    <Col style={{ paddingLeft: '15%' }}>

                                                        {row.userId === storedUserInfo.id || storedUserInfo.id === postData.creatorId ? (

                                                            <>

                                                                <IconButton aria-label="delete" size="large" onClick={() => deleteCommentHandler(row.name, row.comment)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </>
                                                        ) : (<></>)}


                                                        {row.userId === storedUserInfo.id ? (
                                                            <>
                                                                <IconButton onClick={() => handleEditCommentClickOpen(row.comment)}>
                                                                    <EditIcon />
                                                                </IconButton>

                                                                <React.Fragment>

                                                                    <Dialog
                                                                        open={openEditComment}
                                                                        onClose={handleEditCommentClose}
                                                                        aria-labelledby="alert-dialog-title"
                                                                        aria-describedby="alert-dialog-description"
                                                                        fullWidth
                                                                        maxWidth="sm"
                                                                    >
                                                                        <DialogTitle id="alert-dialog-title">
                                                                            {row.name}
                                                                        </DialogTitle>
                                                                        <DialogContent>
                                                                            { }
                                                                            <TextField
                                                                                id="standard-basic"
                                                                                variant="standard"
                                                                                value={editComement}
                                                                                sx={5}
                                                                                fullWidth
                                                                                onChange={(e) => setEditComment(e.target.value)
                                                                                }
                                                                            />
                                                                        </DialogContent>
                                                                        <DialogActions>
                                                                            <Button onClick={handleEditCommentClose}>Cancel</Button>
                                                                            <Button onClick={() => EditCommentHandler(row.name, row.comment, editComement)} autoFocus>
                                                                                Save
                                                                            </Button>
                                                                        </DialogActions>
                                                                    </Dialog>
                                                                </React.Fragment>
                                                            </>
                                                        ) : (<></>)}


                                                    </Col>
                                                    <p>{row.comment}</p>
                                                </Row>

                                            </Row>

                                        ))}


                                    </div>
                                </Row>



                            </div>



                        </div>

                    </>)}


            {/*update workout plan form*/}

            <React.Fragment>
                <Dialog
                    open={openEdit}
                    onClose={handleCloseEdit}
                    scroll={scroll}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    fullWidth
                    maxWidth='md'
                >
                    <DialogTitle id="scroll-dialog-title">Update Workout Plan</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>

                        <div style={{ backgroundColor: "#ffffff", padding: '3%' }}>

                            <Row>
                                <Col xs={6}>
                                    <Row className={WorkoutPalnTempStyle.rows}>

                                        <TextField
                                            id="outlined-basic"
                                            label="WorkOut Name"
                                            placeholder="Name for your Workout Plan"
                                            variant="outlined"
                                            value={name}
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
                                                            <img src={postData.image} alt="Preview" style={{ width: '325px', height: '200px', margin: '0% 0px 0px 13%' }} />
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

                            <Row style={{ paddingBottom: '0%' }}>
                                <TableContainer component={Paper} style={{ padding: '0%' }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                                            borderColor: '#6a0166',
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
                                <Button variant="contained" style={{ backgroundColor: '#6a0166', color: 'white' }} fullWidth onClick={handleAddRowExercise}>Add Rows</Button>

                            </Row>

                            <Row>


                                <Row>


                                    {video && video ? (
                                        <>
                                            <div>
                                                <p>Preview:</p>
                                                <ReactPlayer url={URL.createObjectURL(video)} controls />
                                            </div>
                                        </>) : (
                                        <>
                                            <div>
                                                {videoPreview && videoPreview ? (<>
                                                    <ReactPlayer url={videoPreview} controls />
                                                </>) : (<></>)}
                                            </div>

                                        </>
                                    )}


                                    <div {...getRootProps()} style={dropzoneStyle}>
                                        <input {...getInputProps()} />
                                        <p>Drag & drop a video file here, or click to select one</p>
                                    </div>


                                </Row>


                            </Row>


                            <Row >
                                <Col xs={6}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Intensity</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={intensity}
                                            onClick={(e) => setIntensity(e.target.value)}


                                        >
                                            <FormControlLabel value="Beginner" control={<Radio className={intensity === 'Beginner' ? 'beginner' : ''} />} label="Beginner" />
                                            <FormControlLabel value="Intermediate" control={<Radio className={intensity === 'Intermediate' ? 'intermediate' : ''} />} label="Intermediate" />
                                            <FormControlLabel value="Advanced" control={<Radio className={intensity === 'Advanced' ? 'advanced' : ''} />} label="Advanced" />

                                        </RadioGroup>
                                    </FormControl>
                                </Col>


                                <Col>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password" required>Duration</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={duration}
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

                        </div>


                    </DialogContent>
                    <DialogActions>

                        <Button onClick={handleCloseEdit}>Cancel</Button>
                        <Button onClick={UpdateHandler}>Save</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>


        </>

    )
}

export default WorkoutPlanPostView
