// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactTyped } from 'react-typed';
//import UpdateStyle from "../styles/UpdateStatusStyle.module.css"

const UpdateStatus = () => {

  const {id}  = useParams();     //ID Passingg

  //const id = '663cc31b64978148903772b1';      //Temporily Fetching id
  
  const [user, setUser] = useState('');
  const [description, setDescription] = useState('');
  const [distanceRan, setDistanceRan] = useState(0); // Changed to number
  const [pushups, setPushups] = useState(0); // Changed to number
  const [benchPress, setBenchPress] = useState(0); // Changed to number
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/StatusTest/${id}`);
        const status = response.data;
        setUser(status.user);
        setDescription(status.description);
        setDistanceRan(status.distanceRan); 
        setPushups(status.pushups); 
        setBenchPress(status.benchPress); 
        setComments(status.comments[0]);
      } catch (error) {
        console.error('Error fetching status: ', error);
      }
    };
    fetchStatus();

  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/user/StatusTest/${id}`, {
        user: user,
        description: description,
        distanceRan: parseFloat(distanceRan),
        pushups: parseInt(pushups),
        benchPress: parseFloat(benchPress),
        comments: comments
      });
      alert('Status updated successfully!');
      window.location.href = "/myprofile";
    } catch (error) {
      console.error('Error updating status: ', error);
      alert('Error updating status! ' + error.toString());
      window.location.href = "/myprofile";
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/user/StatusTest/${id}`);
      alert('Status deleted successfully!');

        // Reset form fields after successful submission
        setUser('');
        setDescription('');
        setDistanceRan('');
        setPushups('');
        setBenchPress('');
        setComments('');

        // window.location.href='#./StatusAllSingleUser'
      history.push('/StatusAllSingleUser');
      window.location.href = "/myprofile";
    } catch (error) {
      console.error('Error deleting status: ', error);
      window.location.href = "/myprofile";
      //alert('Error deleting status!');
    }
  };

  const validateWorkoutMetrics = (value) => {
    // Regular expression for xxxx-xxxx format
    const regex = /^[0-9]{4}-[0-9]{4}$/;
    return regex.test(value);
  };

  return (
    <div>
      <h2 style={{ paddingTop: '20px' }}><center><ReactTyped className="fw-bolder"  strings={['Edit your Status here !']} typeSpeed={100} backSpeed={50} loop /></center></h2> 

      <div className="container">
        <h4 className="fw-bolder"><b>Update Status here.</b></h4>
        <form onSubmit={handleUpdate}>
        
            <div className="mb-3">
              <label className="form-label"><b>User</b></label>
              <input type="text" className="form-control" value={user} onChange={(e) => setUser(e.target.value)} readOnly />
              {!validateWorkoutMetrics(description) && <small className="text-danger">Sorry, You are not allowed to edit this field.</small>}
            </div>
            <div className="mb-3">
              <label className="form-label"><b>Description</b></label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><b>Distance Ran (KM)</b></label>
              <input type="number" step="0.01" className="form-control" value={distanceRan} onChange={(e) => setDistanceRan(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><b>Pushups</b></label>
              <input type="number" className="form-control" value={pushups} onChange={(e) => setPushups(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><b>Bench Press (KG)</b></label>
              <input type="number" step="0.01" className="form-control" value={benchPress} onChange={(e) => setBenchPress(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label"><b>Work to be done.</b></label>
              <input type="text" className="form-control" value={comments} onChange={(e) => setComments(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%' }}>Update</button>
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-block mt-2" style={{ width: '100%' }}>Delete</button>
        </form>
      </div>
    </div>

        
    
  );
}

export default UpdateStatus;