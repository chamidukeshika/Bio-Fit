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
  Button,
  Box
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';

const HomeMealPage = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const [mealPlans, setMealPlans] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [newMealComment, setNewMealComment] = useState({});

  const loadData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/mealplan');
      const sortedPlans = response.data.sort((a, b) =>
        new Date(b.creationDate) - new Date(a.creationDate)
      );
      setMealPlans(sortedPlans);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  useEffect(() => {
    document.title = 'HOME | FitConnect';
    loadData();
    return () => {
      document.title = 'FitConnect';
    };
  }, []);

  return (
    <div style={{
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
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            {mealPlans.map((meal) => (
              <Card key={meal.id} sx={{
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
                      {meal.likes?.some(like => like.userId === storedUserInfo.id) ? (
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
                      {meal.likes?.length || 0}
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
          <SideNotoficationPanel />
        </Col>
      </Row>
    </div>
  );
};

export default HomeMealPage;