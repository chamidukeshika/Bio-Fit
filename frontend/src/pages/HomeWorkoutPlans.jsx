import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';



const HomeWorkoutPlans = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);

    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [showComments, setShowComments] = useState({});
    const [newWorkoutComment, setNewWorkoutComment] = useState({});

    const loadData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/workoutPlans/allWorkoutPlans`);
            const sortedPlans = response.data._embedded.workoutPlanList.sort((a, b) => 
                new Date(b.creationDate) - new Date(a.creationDate)
            );
            setWorkoutPlans(sortedPlans);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleWorkoutLike = async (postId) => {
        const post = workoutPlans.find(p => p.id === postId);
        const isLiked = post.likes.some(like => like.userId === storedUserInfo.id);

        try {
            if (isLiked) {
                await axios.put(`http://localhost:8080/api/workoutPlans/unlike/${postId}`, {
                    userId: storedUserInfo.id,
                    name: storedUserInfo.userName
                });
            } else {
                await axios.put(`http://localhost:8080/api/workoutPlans/like/${postId}`, {
                    userId: storedUserInfo.id,
                    name: storedUserInfo.userName
                });
            }

            const updatedWorkoutPlans = workoutPlans.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        likes: isLiked
                            ? p.likes.filter(like => like.userId !== storedUserInfo.id)
                            : [...p.likes, { userId: storedUserInfo.id, name: storedUserInfo.userName }]
                    };
                }
                return p;
            });
            setWorkoutPlans(updatedWorkoutPlans);
        } catch (error) {
            console.error('Error updating workout like:', error);
        }
    };

    const handleLoadWorkoutComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/workoutPlans/viewPost/${postId}`);
            const updatedPost = response.data;
            setWorkoutPlans(prev => prev.map(post =>
                post.id === postId ? { ...post, comments: updatedPost.comments } : post
            ));
        } catch (error) {
            console.error('Error fetching workout comments:', error);
        }
    };

    const toggleComments = (postId) => {
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleAddWorkoutComment = async (postId) => {
        const commentText = newWorkoutComment[postId];
        if (!commentText?.trim()) return;

        const commentOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
            comment: commentText,
        };

        try {
            await axios.put(`http://localhost:8080/api/workoutPlans/comments/${postId}`, commentOb);
            setNewWorkoutComment(prev => ({ ...prev, [postId]: '' }));
            handleLoadWorkoutComments(postId);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteWorkoutComment = async (postId, comment) => {
        const commentOb = {
            name: comment.name,
            comment: comment.comment
        };

        try {
            await axios.put(`http://localhost:8080/api/workoutPlans/deleteComment/${postId}`, commentOb);
            handleLoadWorkoutComments(postId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    useEffect(() => {
        document.title = 'HOME | Bio-Fit';
        loadData();
        return () => {
            document.title = 'Bio-Fit';
        };
    }, []);

    return (
        <div style={{ background: 'rgba(111, 204, 250, 0.6)', minHeight: '100vh' }}>
            <NavBar />
            <Row style={{ width: '100%' }}>
                <Col xs={3}>
                    <SideUserPanel />
                </Col>

                <Col xs={6}>
                    <Container style={{
                        marginTop: "85px",
                        marginLeft: '20px',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {workoutPlans.map((workout) => (
                            <Card key={workout.id} sx={{
                                maxWidth: 800,
                                marginBottom: '24px',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.15)'
                                }
                            }}>
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{
                                            background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
                                            width: 40,
                                            height: 40,
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {workout.name[0]}
                                        </Avatar>
                                    }
                                    title={
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436' }}>
                                            {workout.name}
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography variant="subtitle2" sx={{ color: '#636e72', fontWeight: 500 }}>
                                            {workout.intensity} Workout Plan
                                        </Typography>
                                    }
                                    sx={{ padding: '16px 16px 8px' }}
                                />
                                <Link to={`/WorkoutPlanPostView/${workout.id}`}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={workout.image}
                                        alt={workout.name}
                                        sx={{
                                            objectFit: 'cover',
                                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                                            borderTop: '1px solid rgba(0,0,0,0.08)'
                                        }}
                                    />
                                </Link>
                                <CardContent sx={{ padding: '16px' }}>
                                    <Typography variant="body2" sx={{
                                        color: '#555',
                                        lineHeight: 1.6,
                                        fontSize: '0.9rem',
                                        marginBottom: '12px'
                                    }}>
                                        {workout.description}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        display: 'block',
                                        color: '#1976d2',
                                        fontWeight: 500,
                                        fontStyle: 'italic'
                                    }}>
                                        Created by {workout.creatorName}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 16px',
                                    background: 'rgba(241, 243, 245, 0.4)',
                                    borderTop: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <IconButton onClick={() => handleWorkoutLike(workout.id)} sx={{
                                            padding: '8px',
                                            '&:hover': { background: 'rgba(25, 118, 210, 0.1)' }
                                        }}>
                                            {workout.likes?.some(like => like.userId === storedUserInfo.id) ? (
                                                <ThumbUpIcon color="primary" />
                                            ) : (
                                                <ThumbUpOutlinedIcon />
                                            )}
                                        </IconButton>
                                        <Typography variant="body2" sx={{
                                            marginRight: '16px',
                                            fontWeight: 500,
                                            color: '#2d3436'
                                        }}>
                                            {workout.likes?.length || 0}
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            placeholder="Comment here..."
                                            sx={{
                                                borderRadius: '20px',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '20px',
                                                    paddingRight: '8px',
                                                    background: 'rgba(255,255,255,0.9)'
                                                },
                                                width: '300px'
                                            }}
                                            value={newWorkoutComment[workout.id] || ''}
                                            onChange={(e) => setNewWorkoutComment(prev => ({
                                                ...prev,
                                                [workout.id]: e.target.value
                                            }))}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleAddWorkoutComment(workout.id)}
                                            sx={{
                                                borderRadius: '20px',
                                                background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                                            }}
                                        >
                                            Post
                                        </Button>
                                    </div>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            cursor: 'pointer',
                                            color: '#1976d2',
                                            fontWeight: 500,
                                            '&:hover': { textDecoration: 'underline' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                        onClick={() => {
                                            if (!workout.comments) handleLoadWorkoutComments(workout.id);
                                            toggleComments(workout.id);
                                        }}
                                    >
                                        <ChatBubbleOutlineIcon fontSize="small" />
                                        {workout.comments?.length || 0} comments
                                    </Typography>
                                </CardActions>

                                {showComments[workout.id] && (
                                    <CardContent sx={{
                                        padding: '8px 16px',
                                        background: 'rgba(255,255,255,0.8)'
                                    }}>
                                        {workout.comments?.map(comment => (
                                            <Box key={comment.id || comment.commentId} sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1,
                                                p: 1.5,
                                                borderRadius: '8px',
                                                background: 'rgba(25, 118, 210, 0.05)',
                                                borderLeft: '3px solid #1976d2'
                                            }}>
                                                <Typography variant="body2" sx={{ color: '#2d3436' }}>
                                                    <strong>{comment.name}:</strong> {comment.comment}
                                                </Typography>
                                                {(comment.userId === storedUserInfo.id || workout.creatorId === storedUserInfo.id) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteWorkoutComment(workout.id, comment)}
                                                        sx={{
                                                            marginLeft: 'auto',
                                                            color: '#e74c3c',
                                                            '&:hover': { background: 'rgba(231, 76, 60, 0.1)' }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        ))}
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </Container>
                </Col>
                <Col xs={3}>
                    <SideNotoficationPanel />
                </Col>
            </Row>
        </div>
    )
}

export default HomeWorkoutPlans;