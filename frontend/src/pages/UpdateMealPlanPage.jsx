import React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { CardContent } from '@mui/material';
import { Form } from 'react-bootstrap';
import Button from '@mui/material/Button';
import AddMealPlanPageStyle from '../styles/AddMealPlanPageStyle.module.css';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { storage } from '../Config/FireBaseConfig.js';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';
import { v4 } from 'uuid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const UpdateMealPlanPage = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const { mealplanId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Janul');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [mealCards, setMealCards] = useState([
    {
      name: '',
      ingredients: [],
      instructions: '',
      size: '',
      nutritious: [],
    },
  ]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadData();
  }, [mealplanId]);

  const loadData = async () => {
    try {
      if (mealplanId) {
        const res = await axios.get(
          `http://localhost:8080/api/user/mealplan/${mealplanId}`
        );
        console.log('API response:', res.data);

        if (res.data) {
          const mealPlanData = res.data;

          setTitle(mealPlanData.title);
          setCategory(mealPlanData.category);
          setImagePreview(mealPlanData.mealsPicURL);
          setMealCards(mealPlanData.meals);
        } else {
          toast.error('Failed to fetch meal plan data');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching meal plan data');
    }
  };

  const handleImageChange = (event) => {
    event.preventDefault();
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
  const handleImageClick = () => {
    // Trigger the file input dialog when image is clicked
    document.getElementById('imageInput').click();
  };

  const uploadMealImage = async () => {
    console.log('Image:', image);
    return new Promise((resolve, reject) => {
      if (image == null) {
        resolve(null); // Resolve with null if no image is provided
      } else {
        const MealplanImageRef = ref(
          storage,
          `${userName}/mealImages/${image.name + v4()}`
        );

        uploadBytes(MealplanImageRef, image)
          .then(() => {
            getDownloadURL(MealplanImageRef)
              .then((downloadURL) => {
                console.log('Download URL:', downloadURL);
                alert('Image uploaded. Download URL: ' + downloadURL);
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
    });
  };

  const handleInputChange = (e, field, index) => {
    const { value } = e.target;
    setMealCards((prevCards) => {
      const updatedCards = [...prevCards];

      if (field === 'ingredients' || field === 'nutritious') {
        // Split comma-separated values into an array
        updatedCards[index][field] = value.split(',');
      } else {
        updatedCards[index][field] = value;
      }
      return updatedCards;
    });
  };

  const handleAddMealCard = (e) => {
    e.preventDefault();
    setMealCards((prevCards) => [
      ...prevCards,
      {
        name: '',
        ingredients: [],
        instructions: '',
        size: '',
        nutritious: [],
      },
    ]);
  };

  const handleRemoveMealCard = (index, e) => {
    e.preventDefault();
    setMealCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards.splice(index, 1);
      return updatedCards;
    });
  };

  const submitHandler = async () => {
    const mealPlanImgDownURL = await uploadMealImage();

    const newmealPlanData = {
      userId: storedUserInfo.id,
      title,
      category,
      meals: mealCards,
      mealsPicURL: mealPlanImgDownURL,
    };

    console.log(newmealPlanData);

    axios
      .put(
        `http://localhost:8080/api/user/mealplan/${mealplanId}`,
        newmealPlanData
      )
      .then((response) => {
        console.log('Form submitted successfully!' + response);
        toast.success('Successfully MealPlan Updated!');
        navigate('/myprofile');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
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

  return (
    <div className={AddMealPlanPageStyle.bodyDiv}>
      <div>
        <Row>
          <Col>
            <Card
              variant="outlined"
              style={{
                padding: '0px',
                borderRadius: '6px',
                marginRight: '15%',
              }}
              className={AddMealPlanPageStyle.card}
            >
              <h1 className={AddMealPlanPageStyle.header}>Update Meal Plan</h1>
            </Card>
          </Col>
        </Row>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '3%',
          marginRight: '15%',
        }}
      >
        <Row>
          <Col xs={6} style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Row className={AddMealPlanPageStyle.rows}>
              <TextField
                id="standard-basic"
                label="Meal Title"
                variant="standard"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </Row>

            <Row className={AddMealPlanPageStyle.rows}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={category}
                  required
                  onChange={(e) => setCategory(e.target.value)}
                  label="Age"
                >
                  <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="Vegan">Vegan</MenuItem>
                  <MenuItem value="Keto">Keto</MenuItem>
                </Select>
              </FormControl>
            </Row>
          </Col>

          <Col>
            <Row
              className={AddMealPlanPageStyle.rows}
              style={{ height: '93%' }}
            >
              <Row style={{ paddingLeft: '15%' }}>
                <form>
                  <label>
                    <div style={{ textAlign: 'center' }}>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '325px',
                            height: '200px',
                            margin: '0% 0px 0px 13%',
                          }}
                        />
                      ) : (
                        <img
                          src={'/src/assets/images/menu3.jpg'}
                          alt="Preview"
                          style={{
                            width: '325px',
                            height: '200px',
                            margin: '0% 0px 0px 13%',
                          }}
                        />
                      )}
                    </div>
                  </label>
                </form>
              </Row>

              <Row
                style={{ paddingLeft: '44%', width: '360px', paddingTop: '2%' }}
              >
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

        <br />
        <Row>
          <div
            style={{
              boxShadow: '0px 2px 3px rgba(0, 0, 0, 1.5)',
              backgroundColor: '#40518fcf',
            }}
          >
            <center>
              <label
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: '30px',
                  color: '#fff',
                }}
              >
                Add Meals
              </label>
            </center>
          </div>
        </Row>

        <Row
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'left',
            gap: '10px', // Adjust this value to control the distance between cards
          }}
        >
          {mealCards.map((meal, index) => (
            <Col key={index} style={{ width: '100%', maxWidth: '18rem' }}>
              <div>
                <Card
                  style={{ width: '18rem' }}
                  className={AddMealPlanPageStyle.meal_card}
                >
                  <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <TextField
                      id="standard-basic"
                      label="MealName"
                      variant="standard"
                      value={meal.name}
                      required
                      onChange={(e) => handleInputChange(e, 'name', index)}
                      style={{ width: '100%' }}
                    />
                    <TextField
                      id="standard-multiline-flexible"
                      label="Enter Ingredients"
                      multiline
                      maxRows={4}
                      variant="standard"
                      value={meal.ingredients}
                      required
                      onChange={(e) =>
                        handleInputChange(e, 'ingredients', index)
                      }
                      style={{ width: '100%' }}
                    />
                    <TextField
                      id="standard-multiline-flexible"
                      label="Enter Instructions"
                      multiline
                      maxRows={4}
                      variant="standard"
                      value={meal.instructions}
                      required
                      onChange={(e) =>
                        handleInputChange(e, 'instructions', index)
                      }
                      style={{ width: '100%' }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Enter positon size"
                      variant="standard"
                      value={meal.size}
                      required
                      onChange={(e) => handleInputChange(e, 'size', index)}
                      InputProps={{
                        inputProps: {
                          pattern: '[0-9]+ (mg|kg|l|ml)',
                          title:
                            "Enter necessary measurement (e.g., '100 mg', '200 kg', '5 l', '10 ml')",
                        },
                      }}
                      error={!/^[0-9]+ (mg|kg|l|ml|g)$/.test(meal.size)}
                      helperText={
                        !/^[0-9]+ (mg|kg|l|ml|g)$/.test(meal.size)
                          ? "Enter necessary measurement (e.g., '100 mg', '200 kg', '5 l', '10 ml')"
                          : ''
                      }
                      style={{ width: '100%' }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Enter Nutritious"
                      variant="standard"
                      value={meal.nutritious}
                      required
                      onChange={(e) =>
                        handleInputChange(e, 'nutritious', index)
                      }
                      style={{ width: '100%' }}
                    />
                    <br />
                    <br />
                    <center>
                      <Button
                        variant="outlined"
                        href="#outlined-buttons"
                        onClick={(e) => handleRemoveMealCard(index, e)}
                      >
                        Remove
                      </Button>
                    </center>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>

        <Row style={{ marginTop: '20px' }}>
          <Col>
            <button
              className={AddMealPlanPageStyle.btn_add}
              onClick={(e) => handleAddMealCard(e)}
            >
              ADD
            </button>
          </Col>
        </Row>

        <Row>
          <center>
            <Button type="submit" variant="contained" onClick={submitHandler}>
              Update
            </Button>
          </center>
        </Row>
      </div>
    </div>
  );
};

export default UpdateMealPlanPage;
