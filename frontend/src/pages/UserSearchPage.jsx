import React from 'react'
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import UserSearchStyles from '../styles/UserSearchPageStyle.module.css';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const UserSearchPage = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const [followed, setFollowed] = useState(0);

    const [users, SetUsers] = useState();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter users based on search query
    const filteredUsers = users ? users.filter(user =>
        user.email !== storedUserInfo.email &&
        (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.userName.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/allUsers`); // Make request to backend API endpoint
            SetUsers(response.data); // Update state with retrieved data

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const followAUSer = async (followedUser) => {
        const loginDto = {
            user1: followedUser,
            user2: storedUserInfo.id
        }
        console.log(loginDto);
        try {
            const response = await axios.post(`http://localhost:8080/api/users/follow`, loginDto); // Make request to backend API endpoint
            setFollowed(followed+1)// Update state with retrieved data

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const unfollowAUSer = async (followedUser) => {
        const loginDto = {
            user1: followedUser,
            user2: storedUserInfo.id
        }
        console.log(loginDto);
        try {
            const response = await axios.post(`http://localhost:8080/api/users/unfollow`, loginDto); // Make request to backend API endpoint
            setFollowed(followed+1)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    console.log(users);
    useEffect(() => {
        fetchData();
    }, [followed])

    return (
        <div style={{
            // background: 'linear-gradient(135deg, #E0F7FA, #80DEEA, #4FC3F7, #29B6F6, #039BE5)',
             background: 'rgba(111, 204, 250, 0.6)',
      minHeight: '100vh'
          }}>
        <NavBar />
            <Row>
                <Col xs={3}>
                    <SideUserPanel />

                </Col>
                <Col xs={6}>
                    <Container style={{ marginTop: '12%', paddingRight: '20px' }}>
                        <Row style={{ marginBottom: '2%', backgroundColor: 'white', borderRadius: '10px', padding: '1%' }}>
                            <Col>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        fullWidth
                                    />
                                </Search>
                            </Col>
                        </Row>

                        {filteredUsers && filteredUsers.map((row, index) => (
                            <React.Fragment key={index}>
                                {((row.email) !== (storedUserInfo.email)) && (
                                    <Row className={UserSearchStyles.rowStyle}>
                                        <Link to={`/viewprofile/${row.email}/${row.id}`} style={{ width: '70%', color: 'black' }}>
                                            <Col xs={10}>
                                                <img src={row.profilePicURL} width={70} height={70} style={{ borderRadius: '50%', float: 'left', marginTop: '2%' }} />
                                                <p className={UserSearchStyles.nameStyle}>{row.firstName}  {row.lastName}<br /> <span className={UserSearchStyles.usernameStyle}>{row.userName}</span></p>
                                            </Col>
                                        </Link>
                                        <Col style={{ margin: 'auto' }}>
                                            {row.followers.includes(storedUserInfo.id) ? (
                                                <Button onClick={() => unfollowAUSer(row.id)} style={{ width: '100px' }}>Unfollow</Button>
                                            ) : (
                                                <Button onClick={() => followAUSer(row.id)} style={{ width: '100px' }}>Follow</Button>
                                            )}
                                        </Col>
                                    </Row>

                                )}
                            </React.Fragment>


                        ))}

                    </Container>
                </Col>
                <Col xs={2}>
                    <SideNotoficationPanel />
                </Col>
            </Row>



        </div>
    )
}

export default UserSearchPage
