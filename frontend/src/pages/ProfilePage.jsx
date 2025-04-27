import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import NavBar from '../components/NavBar'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { Fastfood, Search, ListAlt, Settings } from '@mui/icons-material';


import {
    Box,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    IconButton,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    CircularProgress
} from '@mui/material'

// Previously used icons that remain (for tabs and actions)
import {
    Visibility,
    VisibilityOff,
    AddBoxRounded,
    CameraAlt,
    DeleteForever,
    ManageAccounts,
    PeopleOutline,
    PersonAddAlt,
    FitnessCenter,
    Restaurant,
    CheckCircle
} from '@mui/icons-material'

// New icons for profile info fields
import EmailIcon from '@mui/icons-material/Email'
import MaleIcon from '@mui/icons-material/Male'
import ScaleIcon from '@mui/icons-material/Scale'
import StraightenIcon from '@mui/icons-material/Straighten'

import { storage } from "../Config/FireBaseConfig.js"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"
import toast from 'react-hot-toast'

import AllMealPlanPage from './AllMealPlanPage'
import StatusAllSingleUser from './StatusAllSingleUser.jsx'
import AllUserWorkoutPlans from '../components/AllUserWorkoutPlans'

const ProfilePage = () => {
    const userInfoString = localStorage.getItem('UserInfo')
    const storedUserInfo = JSON.parse(userInfoString)
    const [userData, setUserData] = useState('')
    const [updatedUserData, setUpdatedUserData] = useState('')
    const [value, setValue] = useState('0')
    const [open, setOpen] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [dob, setDob] = useState("")
    const [gender, setGender] = useState("")
    const [profileImageURL, setProfileImageURL] = useState("")
    const [userType, setUserType] = useState("User")
    const [weight, setWeight] = useState("")
    const [height, setHeight] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    const [cEmail, setCEmail] = useState("")
    const [deleted, setDeleted] = useState("")
    const [statuAll, setStatusAll] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [updated, setUpdated] = useState("")
    const [profilepicLoading, setProfilepicLoading] = useState(false)

    // ======= STYLES =======
    const pageStyle = {
        background: 'rgba(111, 204, 250, 0.6)',
        minHeight: '100vh',
        padding: '2rem'
    }

    const containerStyle = {
        marginTop: '60px',
        width: '80%',
        padding: '3rem',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.33)',
        backgroundColor: 'rgb(255, 255, 255)'
    }

    // Updated to a soft light blue background instead of pink
    const profileSectionStyle = {
        backgroundColor: 'rgba(5, 169, 251, 0.15)',
        padding: '2rem',
        borderRadius: '10px'
    }

    const profileImageContainerStyle = {
        position: 'relative',
        width: '150px',
        height: '150px',
        margin: 'auto'
    }

    const profileImageStyle = {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover'
    }

    const cameraIconButtonStyle = {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#fff',
        color: '#1976d2',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        width: '36px',
        height: '36px'
    }

    const iconButtonStyle = {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '0.5rem',
        borderRadius: '50%'
    }

    // ======= HANDLERS =======
    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0]
        setImage(selectedImage)

        // Preview the selected image
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagePreview(reader.result)
            }
        }
        if (selectedImage) {
            reader.readAsDataURL(selectedImage)
        }
    }

    const uploadProfileImage = async () => {
        return new Promise((resolve, reject) => {
            if (!image) {
                resolve(null)
            } else {
                const ProfileImageRef = ref(
                    storage,
                    `${userName}/profileImages/${image.name + v4()}`
                )
                uploadBytes(ProfileImageRef, image)
                    .then(() => {
                        getDownloadURL(ProfileImageRef)
                            .then((downloadURL) => {
                                toast.success("Profile Picture Updated")
                                resolve(downloadURL)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }
        })
    }

    const updateprileImage = async () => {
        setProfilepicLoading(true)
        const profileimgLink = await uploadProfileImage()
        const profilePicUrl = {
            profilePicLink: profileimgLink
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/users/updateProfilePic/${storedUserInfo.id}`, profilePicUrl)
            setUpdated(response.data)
            setImage(profileimgLink)
            setImagePreview("")
            setProfilepicLoading(false)
        } catch (error) {
            console.error("error uploading image", error)
            setProfilepicLoading(false)
        }
    }

    const handleClickShowPassword = () => setShowPassword((prev) => !prev)
    const handleMouseDownPassword = (event) => event.preventDefault()
    const handleClickShowCPassword = () => setShowCPassword((prev) => !prev)
    const handleMouseDownCPassword = (event) => event.preventDefault()

    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleClickOpenDel = () => setOpenDel(true)
    const handleCloseDel = () => setOpenDel(false)

    const handleChange = (event, newValue) => setValue(newValue)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`http://localhost:8080/api/users/getUserByEmail/${storedUserInfo.email}`)
            setUserData(response.data)
            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setUserName(response.data.userName)
            setEmail(response.data.email)
            setDob(response.data.dob)
            setGender(response.data.gender)
            setWeight(response.data.weight)
            setHeight(response.data.height)
            setPassword(response.data.password)
            setCPassword(response.data.password)
            setImage(response.data.profilePicURL)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setIsLoading(false)
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/user/StatusTest/user/${storedUserInfo.userName}`)
            setStatusAll(response.data)
        } catch (error) {
            console.error('Error fetching status:', error)
        }
    }

    const handleUpdate = async () => {
        handleClose()
        const updatedUser = {
            firstName,
            lastName,
            userName,
            email,
            dob,
            profilePicURL: userData.profilePicURL,
            gender,
            weight,
            height,
            password,
            userType,
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/users/${storedUserInfo.id}`, updatedUser)
            setUpdatedUserData(response.data)
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    const haldleDelete = async () => {
        handleCloseDel()
        try {
            const response = await axios.delete(`http://localhost:8080/api/users/${storedUserInfo.id}`)
            setDeleted(response.data)
            localStorage.removeItem("UserInfo")
            window.location.href = "/register"
        } catch (error) {
            console.error('Error deleting profile:', error)
        }
    }

    // ======= LIFECYCLE =======
    useEffect(() => { fetchData() }, [updatedUserData, deleted, updated])

    // ======= RENDER =======
    return (
        <div style={pageStyle}>
            <NavBar />
            <Container style={containerStyle}>
                {isLoading ? (
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Row className="align-items-center">
                            {/* PROFILE PICTURE & CAMERA ICON */}
                            <Col xs={4} className="text-center">
                                <div style={profileImageContainerStyle}>
                                    {profilepicLoading ? (
                                        <Box textAlign="center" style={{ marginTop: '2rem' }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <>
                                            <img
                                                src={
                                                    imagePreview
                                                        ? imagePreview
                                                        : image
                                                            ? image
                                                            : '/src/assets/images/user-avatars.png'
                                                }
                                                alt="Profile"
                                                style={profileImageStyle}
                                            />
                                            <IconButton
                                                style={cameraIconButtonStyle}
                                                component="label"
                                            >
                                                <CameraAlt />
                                                <input
                                                    hidden
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={handleImageChange}
                                                />
                                            </IconButton>
                                        </>
                                    )}
                                </div>
                                {imagePreview && (
                                    <Button
                                        onClick={updateprileImage}
                                        variant="primary"
                                        style={{ marginTop: '1rem' }}
                                    >
                                        Save
                                    </Button>
                                )}
                            </Col>

                            {/* PROFILE INFO with added icons */}
                            <Col style={profileSectionStyle}>
                                <Row>
                                    <Col>
                                        <h2 style={{ fontFamily: 'Segoe UI, sans-serif', marginBottom: '0.3rem' }}>
                                            {userData.firstName} {userData.lastName}
                                        </h2>
                                        <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                            <strong>@{userData.userName}</strong>
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon style={{ marginRight: 4, color: '#1976d2', fontSize: '1rem' }} /> {userData.email}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                                            <MaleIcon style={{ marginRight: 4, color: '#1976d2', fontSize: '1rem' }} /> {userData.gender}
                                        </p>
                                        {userData.weight && (
                                            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                                                <ScaleIcon style={{ marginRight: 4, color: '#1976d2', fontSize: '1rem' }} /> <b>{userData.weight} KG</b> &nbsp; &nbsp;
                                                <StraightenIcon style={{ marginRight: 4, color: '#1976d2', fontSize: '1rem' }} /> <b>{userData.height} m</b>
                                            </p>
                                        )}
                                    </Col>

                                    <Col className="d-flex flex-column justify-content-between align-items-end">
                                        <div>
                                            <Button
                                                onClick={handleClickOpen}
                                                variant="outline-secondary"
                                                style={{ marginRight: '1rem' }}
                                            >
                                                <ManageAccounts style={{ marginRight: 4 }} />
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={handleClickOpenDel}
                                                variant="danger"
                                            >
                                                <DeleteForever style={{ marginRight: 4 }} />
                                                Delete
                                            </Button>
                                        </div>
                                        <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
                                            <PeopleOutline style={{ marginRight: 4, color: '#1976d2', fontSize: '1.5rem' }} />
                                            {userData.followers?.length || 0} Followers &nbsp;&nbsp;
                                            <PersonAddAlt style={{ marginRight: 4, color: '#1976d2', fontSize: '1.5rem' }} />
                                            {userData.following?.length || 0} Following
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* STATUS SECTION */}
                        <Row
                            style={{
                                marginTop: '2rem',
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                paddingBottom: '1rem'
                            }}
                        >
                            <Col xs={12} className="d-flex align-items-center">
                                {/* Only render the Add Status icon */}
                                <Link to="/AddStatus">
                                    <IconButton
                                        style={{
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            marginRight: '1rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <AddBoxRounded style={{ fontSize: 20 }} />
                                    </IconButton>
                                </Link>

                                {/* Render user statuses as small icons */}
                                {statuAll && statuAll.map((row, index) => (
                                    <Box key={index} style={{ marginRight: '1rem' }}>
                                        <IconButton
                                            style={{
                                                backgroundColor: '#eee',
                                                color: '#1976d2'
                                            }}

                                        >
                                            <CheckCircle style={{ fontSize: 30 }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Col>
                        </Row>

                        <hr style={{ margin: '2rem 0' }} />

                        {/* TABS SECTION */}
                        <Row>
                            <TabContext value={value}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="Profile Tabs"
                                    centered
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                >
                                    <Tab
                                        icon={<FitnessCenter style={{ fontSize: 30 }} />}
                                        label="Workout Plans"
                                        value="0"
                                    />
                                    <Tab
                                        icon={<Fastfood style={{ fontSize: 30 }} />}
                                        label="Meal Plans"
                                        value="1"
                                    />
                                    <Tab
                                        icon={<ListAlt style={{ fontSize: 30 }} />}
                                        label="Status"
                                        value="2"
                                    />
                                </Tabs>
                                <TabPanel value="0">
                                    <Link to="/workoutPlanTemplate">
                                        <Box textAlign="center" mb={2}>
                                            <Button variant="contained" style={iconButtonStyle}>
                                                <AddBoxRounded style={{ fontSize: 30 }} />
                                            </Button>
                                        </Box>
                                    </Link>
                                    <AllUserWorkoutPlans userId={storedUserInfo.id} />
                                </TabPanel>
                                <TabPanel value="1">
                                    <Link to="/mealplan">
                                        <Box textAlign="center" mb={2}>
                                            <Button variant="contained" style={iconButtonStyle}>
                                                <AddBoxRounded style={{ fontSize: 30 }} />
                                            </Button>
                                        </Box>
                                    </Link>
                                    <AllMealPlanPage userId={storedUserInfo.id} />
                                </TabPanel>
                                <TabPanel value="2">
                                    <Link to="/AddStatus">
                                        <Box textAlign="center" mb={2}>
                                            <Button variant="contained" style={iconButtonStyle}>
                                                <AddBoxRounded style={{ fontSize: 30 }} />
                                            </Button>
                                        </Box>
                                    </Link>
                                    <StatusAllSingleUser />
                                </TabPanel>
                            </TabContext>

                        </Row>
                    </>
                )}

                {/* EDIT PROFILE DIALOG */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault()
                            const formData = new FormData(event.currentTarget)
                            const formJson = Object.fromEntries(formData.entries())
                            console.log(formJson.email)
                            handleClose()
                        }
                    }}
                >
                    <DialogTitle>Edit Your Profile</DialogTitle>
                    <DialogContent>
                        <Row>
                            <Col xs={8}>
                                <Row>
                                    <Col>
                                        <Box noValidate autoComplete="off">
                                            <TextField
                                                label="First Name"
                                                variant="outlined"
                                                margin="normal"
                                                size="small"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </Box>
                                    </Col>
                                    <Col>
                                        <Box noValidate autoComplete="off">
                                            <TextField
                                                label="Last Name"
                                                variant="outlined"
                                                margin="normal"
                                                size="small"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </Box>
                                    </Col>
                                </Row>
                                <Row>
                                    <Box noValidate autoComplete="off">
                                        <TextField
                                            label="UserName"
                                            variant="outlined"
                                            margin="normal"
                                            size="small"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            fullWidth
                                            disabled
                                        />
                                    </Box>
                                </Row>
                                <Row>
                                    <Col>
                                        <Box noValidate autoComplete="off">
                                            <TextField
                                                label="Email"
                                                variant="outlined"
                                                margin="normal"
                                                size="small"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                disabled
                                            />
                                        </Box>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '1rem' }}>
                            <Col>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                    Date of Birth <span>*</span>:
                                </label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    style={{
                                        padding: '0.5rem',
                                        border: '1px solid #bcbcbc',
                                        borderRadius: '5px',
                                        width: '100%'
                                    }}
                                    required
                                />
                            </Col>
                            <Col className="d-flex align-items-center justify-content-center">
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    </RadioGroup>
                                </FormControl>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '1rem' }}>
                            <Col>
                                <FormControl variant="outlined" size="small" margin="normal" fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-weight">Weight</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-weight"
                                        endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                        label="Weight"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        type="number"
                                    />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl variant="outlined" size="small" margin="normal" fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-height">Height</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-height"
                                        endAdornment={<InputAdornment position="end">m</InputAdornment>}
                                        label="Height"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        type="number"
                                    />
                                </FormControl>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '1rem' }}>
                            <Col>
                                <FormControl variant="outlined" size="small" margin="normal" fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>
                            </Col>
                            <Col>
                                <FormControl variant="outlined" size="small" margin="normal" fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-cpassword">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-cpassword"
                                        type={showCPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowCPassword}
                                                    onMouseDown={handleMouseDownCPassword}
                                                    edge="end"
                                                >
                                                    {showCPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirm Password"
                                        value={cpassword}
                                        onChange={(e) => setCPassword(e.target.value)}
                                    />
                                </FormControl>
                            </Col>
                        </Row>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" onClick={handleUpdate}>Save</Button>
                    </DialogActions>
                </Dialog>

                {/* DELETE PROFILE DIALOG */}
                <Dialog
                    open={openDel}
                    onClose={handleCloseDel}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault()
                            const formData = new FormData(event.currentTarget)
                            const formJson = Object.fromEntries(formData.entries())
                            console.log(formJson.email)
                            handleCloseDel()
                        }
                    }}
                >
                    <DialogTitle>Delete Your Account</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter your email to delete the account.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={cEmail}
                            onChange={(e) => setCEmail(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDel}>Cancel</Button>
                        {cEmail === storedUserInfo.email ? (
                            <Button type="submit" color="error" onClick={haldleDelete}>
                                Delete
                            </Button>
                        ) : (
                            <Button type="submit" color="error" disabled>
                                Delete
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    )
}

export default ProfilePage
