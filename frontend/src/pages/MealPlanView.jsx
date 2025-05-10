import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import MealPlanViewPageStyle from '../styles/MealPlanViewPageStyle.module.css';
import Box from '@mui/joy/Box';
//import Button from '@mui/joy/Button';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import { Link as CustomLink } from 'react-router-dom';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

//transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const MealPlanView = () => {
  //comment box
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);

  //dialog box in deletePost
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [name, setName] = useState('');

  const { mealplanId } = useParams();
  const [mealPlanData, setmealPlanData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const navigate = useNavigate();

  //like
  const [userLiked, setUserLiked] = useState(false);
  const [isLike, setIsLike] = useState();
  const [openLike, setOpenLike] = useState(false);

  //add a comment
  const [commentString, setComment] = useState('');
  const [sendComment, setsendComment] = useState(false);

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

  console.log(mealplanId.id);

  const deleteHandler = () => {
    axios
      .delete(`http://localhost:8080/api/user/mealplan/${mealplanId}`)
      .then((response) => {
        console.log('MealPlan deleted successfully!' + response);
        navigate('/myprofile');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addCommentHandler = async () => {
    console.log(commentString);
    const commentOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
      comment: commentString,
    };
    console.log(commentOb);
    await axios
      .put(
        `http://localhost:8080/api/user/mealplan/comments/${mealplanId}`,
        commentOb
      )
      .then((response) => {
        setsendComment(true);
        console.log('Comment updated successfully!' + response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const likeHandler = async () => {
    const likeOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
    };

    console.log(likeOb);
    await axios
      .put(`http://localhost:8080/api/user/mealplan/like/${mealplanId}`, likeOb)
      .then((response) => {
        console.log('liked successfully!' + response);
        setIsLike(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const UnLikeHandler = async () => {
    const unlikeOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
    };

    console.log(unlikeOb);
    await axios
      .put(
        `http://localhost:8080/api/user/mealplan/unlike/${mealplanId}`,
        unlikeOb
      )
      .then((response) => {
        console.log('UnLiked successfully!' + response);
        setIsLike(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  //useEffect
  useEffect(() => {
    const fetchDataAndCheckLike = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/user/mealplan/${mealplanId}`
        );

        setmealPlanData(response.data);

        const isLikedByUser = response.data.likes.some(
          (like) => like.userId === storedUserInfo.id
        );
        setUserLiked(isLikedByUser);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchDataAndCheckLike();
  }, [isLike, sendComment]);

  return (
    <>
      <NavBar />

      <div className={MealPlanViewPageStyle.bodyDivPostView}>
        <Row>
          <Col xs={5}>
            <Card
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
                marginTop: '20px',
                marginLeft: '20px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '3%',
                  marginBottom: '10px',
                  maxWidth: '775px',
                }}
              >
                <Row>
                  <Row>
                    <Col>
                      <div
                        style={{
                          backgroundImage: `url(${mealPlanData.mealsPicURL})`,
                          backgroundColor: 'rgb(207 202 101)',
                          height: '250px',
                          width: '400px',
                          marginTop: '3%',
                          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', // Adding a shadow effect
                          borderRadius: '10px', // Optional: Adding border radius for a rounded border
                          boxSizing: 'border-box', // Ensures the shadow doesn't affect the layout
                        }}
                      ></div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h1 style={{ paddingTop: '10%', fontSize: '1.5rem' }}>
                        Title : {mealPlanData.title}
                      </h1>
                      <p style={{ margin: '0%', fontSize: '1rem' }}>
                        Category : {mealPlanData.category}
                      </p>
                    </Col>
                  </Row>
                  <br />
                  <br />

                  <Row>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      {mealPlanData.userId === storedUserInfo.id ? (
                        <>
                          <CustomLink
                            to={`/mealplan/read/update/${mealPlanData.id}`}
                          >
                            <Button
                              variant="info"
                              style={{ marginRight: '10px' }}
                            >
                              Edit
                            </Button>
                          </CustomLink>

                          <Button variant="info" onClick={handleClickOpen}>
                            Delete
                          </Button>
                        </>
                      ) : (
                        <></>
                      )}

                      <React.Fragment>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-slide-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {'Do you really want to delete the Meal Plan?'}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              <span style={{ color: 'red' }}>
                                This action cannot be undone.
                              </span>
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Disagree</Button>
                            <Button onClick={deleteHandler}>Agree</Button>
                          </DialogActions>
                        </Dialog>
                      </React.Fragment>
                    </Col>
                  </Row>
                  <br />
                  <br />

                  <Row>
                    <Col xs={2}>
                      {userLiked && userLiked ? (
                        <>
                          <IconButton onClick={UnLikeHandler}>
                            <ThumbUpIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={likeHandler}>
                            <ThumbUpOutlinedIcon />
                          </IconButton>
                        </>
                      )}
                    </Col>
                    <Col>
                      <Button
                        style={{ color: 'black', background: '#f6f6f6' }}
                        onClick={handleLikeClickOpen}
                      >
                        ({mealPlanData.likes && mealPlanData.likes.length})
                        likes
                      </Button>

                      <React.Fragment style={{ background: '#66526469' }}>
                        <Dialog
                          style={{ background: '#66526469' }}
                          open={openLike}
                          onClose={handleLikeClickClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                          fullWidth
                          maxWidth="xs"
                        >
                          <DialogTitle
                            style={{ marginLeft: '40%' }}
                            id="alert-dialog-title"
                          >
                            {'Likes'}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              {mealPlanData.likes &&
                                mealPlanData.likes.map((row) => (
                                  <Row
                                    style={{
                                      background: '#edebff',
                                      margin: '5% 1% -3% 1%',
                                    }}
                                  >
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
                </Row>
              </div>
            </Card>
          </Col>

          <Col>
            <Card
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '10px',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', // Shadow effect
                marginTop: '20px',
                marginRight: '20px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '3%',
                  marginBottom: '10px',
                  maxWidth: '775px',
                }}
              >
                <Row>
                  <Col>
                    <Row style={{ paddingBottom: '2%' }}>
                      <h4>Meals</h4>
                    </Row>
                  </Col>
                </Row>

                {mealPlanData.meals &&
                  mealPlanData.meals.map((row, index) => (
                    <Card
                      key={index}
                      style={{
                        margin: '10px',
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" component="div">
                          <b>Name :</b> {row.name}
                        </Typography>
                        <Typography variant="body1" component="div">
                          <b>Ingredients :</b> {row.ingredients.join(' ,')}
                        </Typography>
                        <Typography variant="body1" component="div">
                          <b>Instructions :</b> {row.instructions}
                        </Typography>
                        <Typography variant="body1" component="div">
                          <b>Size :</b> {row.size}
                        </Typography>
                        <Typography variant="body1" component="div">
                          <b>Nutritious :</b> {row.nutritious.join(' ,')}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}

                <Row>
                  <div
                    style={{
                      padding: '3%',
                      marginBottom: '10px',
                      maxWidth: '775px',
                      border: '1px solid rgb(185 175 175)',
                    }}
                  >
                    <Row style={{ paddingBottom: '2%' }}>
                      <h4>
                        Comments(
                        {mealPlanData.comments && mealPlanData.comments.length}
                        )...
                      </h4>
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
                                onClick={(event) =>
                                  setAnchorEl(event.currentTarget)
                                }
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
                                      {fontWeight === weight && (
                                        <Check fontSize="sm" />
                                      )}
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
                              <Button
                                sx={{ ml: 'auto' }}
                                onClick={() => addCommentHandler()}
                              >
                                Send
                              </Button>
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

                    {mealPlanData.comments &&
                      mealPlanData.comments.map((row) => (
                        <Row
                          style={{
                            padding: '3%',
                            margin: '5%',
                            marginTop: '10px',
                            marginBottom: '10px',
                            maxWidth: '775px',
                            borderRadius: '9px',
                            boxShadow: '0px 0px 12px 0px rgb(237 230 230)',
                          }}
                        >
                          <Row>
                            <Col xs={8}>
                              <p style={{ color: '#9d00c2' }}>{row.name}</p>
                            </Col>
                            <Col style={{ paddingLeft: '15%' }}>
                              <IconButton aria-label="delete" size="large">
                                <DeleteIcon />
                              </IconButton>
                              <IconButton>
                                <EditIcon />
                              </IconButton>
                            </Col>
                            <p>{row.comment}</p>
                          </Row>
                        </Row>
                      ))}
                  </div>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MealPlanView;
