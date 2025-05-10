// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AllStatusSingleCardStyle.module.css";
import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';


const StatusAllSingleUserCard = () => {

  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const [data, setData] = useState([]);
  const username = storedUserInfo.userName;                   //Fetching User User Name
  const profilePic = storedUserInfo.profilePicURL;             //Fetching User Profile Picture
  console.log(username)

  useEffect(() => {
    const fetchData = async () => {
      try {


        const response = await axios.get(`http://localhost:8080/api/user/StatusTest/user/${username}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (createdAt) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Date(createdAt).toLocaleString(undefined, options);
  };

  return (
    <div className="container">
      <h2 style={{ paddingTop: '20px' }}><center><ReactTyped className="fw-bolder"  strings={['My Status Line !']} typeSpeed={100} backSpeed={50} loop /></center></h2> 
      <div className="row">
        {data.map((item) => (
          <div key={item.id} className="col-md-4">
            <div className="card mb-4 custom-card">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={profilePic} style={{ width: '150px', height: '150px', borderRadius: '50%', paddingTop: 10, paddingLeft: 10, paddingRight: 10 }} alt="Profile_Picture" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title"><b>{item.user}</b></h5>
                    <p className="card-text"><b>Highlight of the week : </b></p>
                    <p className="card-text">*{item.description}</p>
                    <p className="card-text"><b>Best Run : </b> {item.distanceRan} <b>KM</b></p>
                    <p className="card-text"><b>Max Push-ups : </b> {item.pushups}</p>
                    <p className="card-text"><b>Max BenchPress : </b> {item.benchPress} <b>KG</b></p>
                    <p className="card-text"><b>Work to be done : </b> {item.comments} </p>

                    {/* Button */}
                    <div style={{ marginTop: "10px" }}>
                      <Link to={`/UpdateStatusPage/${item.id}`} className="btn btn-outline-danger" style={{ width: "100%" }}>Edit My Status</Link>
                    </div>
                    <p className="card-text"><small className="text-muted">{formatDate(item.createdAt)}</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusAllSingleUserCard;
