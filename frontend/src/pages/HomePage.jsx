import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SideUserPanel from '../components/SideUserPanel';
import SideNotificationPanel from '../components/SideNotoficationPanel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { red } from '@mui/material/colors';

const HomePage = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const [mealPlans, setMealPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [newWorkoutComment, setNewWorkoutComment] = useState({});
  const [newMealComment, setNewMealComment] = useState({});

  const loadData = async () => {
    try {
      const [workoutResponse, mealResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/workoutPlans/allWorkoutPlans'),
        axios.get('http://localhost:8080/api/user/mealplan')
      ]);

      let workoutPlans = workoutResponse.data._embedded.workoutPlanList;
      let mealPlans = mealResponse.data;

      // Combine both lists
      let combinedList = [...workoutPlans, ...mealPlans];

      // Sort by creationDate in descending order (latest first)
      combinedList.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

      // Set the sorted lists back
      setWorkoutPlans(combinedList.filter(item => workoutPlans.includes(item)));
      setMealPlans(combinedList.filter(item => mealPlans.includes(item)));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {
    document.title = 'HOME | Bio-Fit';
    loadData();
    return () => {
      document.title = 'Bio-Fit';
    };
  }, []);

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

  const handleMealLike = async (mealPlanId) => {
    const mealPlan = mealPlans.find(m => m.id === mealPlanId);
    const isLiked = mealPlan.likes.some(like => like.userId === storedUserInfo.id);

    try {
      if (isLiked) {
        await axios.put(`http://localhost:8080/api/user/mealplan/unlike/${mealPlanId}`, {
          userId: storedUserInfo.id,
          name: storedUserInfo.userName
        });
      } else {
        await axios.put(`http://localhost:8080/api/user/mealplan/like/${mealPlanId}`, {
          userId: storedUserInfo.id,
          name: storedUserInfo.userName
        });
      }

      const updatedMealPlans = mealPlans.map(m => {
        if (m.id === mealPlanId) {
          return {
            ...m,
            likes: isLiked
              ? m.likes.filter(like => like.userId !== storedUserInfo.id)
              : [...m.likes, { userId: storedUserInfo.id, name: storedUserInfo.userName }]
          };
        }
        return m;
      });
      setMealPlans(updatedMealPlans);
    } catch (error) {
      console.error('Error updating meal plan like:', error);
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

  const handleLoadMealComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/mealplan/${postId}`);
      const updatedMeal = response.data;
      setMealPlans(prev => prev.map(meal =>
        meal.id === postId ? { ...meal, comments: updatedMeal.comments } : meal
      ));
    } catch (error) {
      console.error('Error fetching meal comments:', error);
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

  const handleAddMealComment = async (postId) => {
    const commentText = newMealComment[postId];
    if (!commentText?.trim()) return;

    const commentOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
      comment: commentText,
    };

    try {
      await axios.put(`http://localhost:8080/api/user/mealplan/comments/${postId}`, commentOb);
      setNewMealComment(prev => ({ ...prev, [postId]: '' }));
      handleLoadMealComments(postId);
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
      console.log(commentOb);
      await axios.put(`http://localhost:8080/api/workoutPlans/deleteComment/${postId}`, commentOb)
        .then(response => {
          console.log("Comment deleted successfully!" + response);
        })
      handleLoadWorkoutComments(postId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteMealComment = async (postId, comment) => {
    const commentOb = {
      name: comment.name,
      comment: comment.comment
    };

    try {
      await axios.put(`http://localhost:8080/api/user/mealplan/deleteComment/${postId}`, commentOb);
      handleLoadMealComments(postId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div style={{
      // background: 'linear-gradient(135deg, #E0F7FA, #80DEEA, #4FC3F7, #29B6F6, #039BE5)',
      background: 'rgba(111, 204, 250, 0.6)',
      minHeight: '100vh'
    }}>

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
            background: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            {workoutPlans.map((workout) => (
              <Card key={`workout-${workout.id}`} sx={{
                maxWidth: 800,
                marginBottom: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgb(255, 255, 255)',
                backdropFilter: 'blur(10px)',
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
                <CardMedia
                  component="img"
                  height="240"
                  image={workout.image}
                  alt={workout.name}
                  sx={{
                    objectFit: 'contain',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    borderTop: '1px solid rgba(0,0,0,0.08)'
                  }}
                />
                <CardContent sx={{ padding: '16px' }}>
                  <Typography variant="body2" sx={{
                    color: '#555',
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    {workout.description}
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
                      '&:hover': {
                        background: 'rgba(25, 118, 210, 0.1)'
                      }
                    }}>
                      {workout.likes.some(like => like.userId === storedUserInfo.id) ? (
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
                      {workout.likes.length}
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                    </Box>
                  </div>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: 'pointer',
                      color: '#1976d2',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#1864ab'
                      },
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
                              '&:hover': {
                                background: 'rgba(231, 76, 60, 0.1)'
                              }
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

            {mealPlans.map((meal) => (
              <Card key={`meal-${meal.id}`} sx={{
                maxWidth: 800,
                marginBottom: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(220, 38, 38, 0.15)'
                }
              }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{
                      background: 'linear-gradient(45deg, #e53935 30%, #ef5350 90%)',
                      width: 40,
                      height: 40,
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      {meal.title[0]}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436' }}>
                      {meal.title}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="subtitle2" sx={{ color: '#636e72', fontWeight: 500 }}>
                      {meal.category} Meal Plan
                    </Typography>
                  }
                  sx={{ padding: '16px 16px 8px' }}
                />
                <CardMedia
                  component="img"
                  height="240"
                  image={meal.mealsPicURL}
                  alt={meal.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    borderTop: '1px solid rgba(0,0,0,0.08)'
                  }}
                />
                <CardActions disableSpacing sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: 'rgba(241, 243, 245, 0.4)',
                  borderTop: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconButton onClick={() => handleMealLike(meal.id)} sx={{
                      padding: '8px',
                      '&:hover': {
                        background: 'rgba(220, 38, 38, 0.1)'
                      }
                    }}>
                      {meal.likes.some(like => like.userId === storedUserInfo.id) ? (
                        <ThumbUpIcon style={{ color: '#e53935' }} />
                      ) : (
                        <ThumbUpOutlinedIcon />
                      )}
                    </IconButton>
                    <Typography variant="body2" sx={{
                      marginRight: '16px',
                      fontWeight: 500,
                      color: '#2d3436'
                    }}>
                      {meal.likes.length}
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
                      value={newMealComment[meal.id] || ''}
                      onChange={(e) => setNewMealComment(prev => ({
                        ...prev,
                        [meal.id]: e.target.value
                      }))}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleAddMealComment(meal.id)}
                        sx={{
                          borderRadius: '20px',
                          background: 'linear-gradient(45deg, #e53935 30%, #ef5350 90%)',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                        }}
                      >
                        Post
                      </Button>
                    </Box>
                  </div>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: 'pointer',
                      color: '#e53935',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#c62828'
                      },
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onClick={() => {
                      if (!meal.comments) handleLoadMealComments(meal.id);
                      toggleComments(meal.id);
                    }}
                  >
                    <ChatBubbleOutlineIcon fontSize="small" />
                    {meal.comments?.length || 0} comments
                  </Typography>
                </CardActions>

                {showComments[meal.id] && (
                  <CardContent sx={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.8)'
                  }}>
                    {meal.comments?.map(comment => (
                      <Box key={comment.id || comment.commentId} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        p: 1.5,
                        borderRadius: '8px',
                        background: 'rgba(220, 38, 38, 0.05)',
                        borderLeft: '3px solid #e53935'
                      }}>
                        <Typography variant="body2" sx={{ color: '#2d3436' }}>
                          <strong>{comment.name}:</strong> {comment.comment}
                        </Typography>
                        {(comment.userId === storedUserInfo.id || meal.userId === storedUserInfo.id) && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMealComment(meal.id, comment)}
                            sx={{
                              marginLeft: 'auto',
                              color: '#e74c3c',
                              '&:hover': {
                                background: 'rgba(231, 76, 60, 0.1)'
                              }
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
          <SideNotificationPanel />
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;