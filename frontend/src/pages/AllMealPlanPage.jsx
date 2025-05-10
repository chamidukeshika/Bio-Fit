import React from 'react';
import { Collapse, IconButton, Alert, Card, CardContent } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Container, Row, Col, CardBody } from 'react-bootstrap';
import AllMealPlanPageStyle from '../styles/AllMealPlanPageStyle.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link as CustomLink } from 'react-router-dom';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const AllMealPlanPage = (props) => {

  const [noticeStatus, setNoticeStatus] = useState(true);
  const [mealplans, setMealPlans] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {

    try {
      const res = await axios.get(
        `http://localhost:8080/api/user/mealplan/user/${props.userId}`
      );
      if (res.status === 200) {
        // Check if the response data has a "_embedded" property
        if (res.data._embedded && res.data._embedded.mealPlanList) {
          setMealPlans(res.data._embedded.mealPlanList);
        } else {
          setMealPlans([]);
        }
      } else {
        setMealPlans([]);
        toast.error('Failed to fetch meal plans');
      }
    } catch (err) {
      toast.error(err.data?.message || err.error);
      setMealPlans([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Container>
        
        <Row>
          <Collapse in={noticeStatus}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setNoticeStatus(false);
                  }}
                >
                  {' '}
                  <Close fontSize="inherit" />{' '}
                </IconButton>
              }
              sx={{ mt: 2, bgcolor: 'rgb(177 232 255)' }}
              severity="info"
            >
              <strong>Info</strong> - To View The Meals Related to a Meal Plan
              Clik On More !!!!.
            </Alert>
          </Collapse>
        </Row>
        <br />
        <Row style={{ marginLeft: '10px', marginRight: '10px' }}>
          {Array.isArray(mealplans) && mealplans.length === 0 ? (
            <Col>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'dimgrey',
                }}
              >
                <h2>No meal plans available !!!!</h2>
              </div>
            </Col>
          ) : (
            <>
              <Row
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'left',
                  gap: '10px',
                }}
              >
                {mealplans.map((mealplan, index) => (
                  <Col key={index} style={{ marginRight: '1px' }}>
                    <Card style={{ maxWidth: 345 }}>
                      <CardBody
                        style={{
                          maxHeight: '400px',
                          overflowY: 'auto',
                        }}
                      >
                        <CardMedia
                          sx={{ height: 140 }}
                          image={mealplan.mealsPicURL} // Use mealplan.mealsPicURL as the image source
                          title="Meal Image"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {mealplan.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {mealplan.category}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <CustomLink to={`/mealplan/read/view/${mealplan.id}`}>
                            <Button size="small">More...</Button>
                          </CustomLink>
                        </CardActions>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default AllMealPlanPage;
