// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateStatusStyles from "../styles/UpdateStatusStyle.module.css"

const UpdateStatus = () => {

  const {id}  = useParams();
  
  const [user, setUser] = useState('');
  const [description, setDescription] = useState('');
  const [distanceRan, setDistanceRan] = useState(0); // Changed to number
  const [pushups, setPushups] = useState(0); // Changed to number
  const [benchPress, setBenchPress] = useState(0); // Changed to number
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/StatusTest/6636dea9cedb6b588ac7fa54');
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
      await axios.put('http://localhost:8080/api/user/StatusTest/6636dea9cedb6b588ac7fa54', {
        user: user,
        description: description,
        distanceRan: parseFloat(distanceRan),
        pushups: parseInt(pushups),
        benchPress: parseFloat(benchPress),
        comments: comments
      });
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status: ', error);
      alert('Error updating status! ' + error.toString());
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:8080/api/user/StatusTest/6636dea9cedb6b588ac7fa54');
      alert('Status deleted successfully!');

        // Reset form fields after successful submission
        setUser('');
        setDescription('');
        setDistanceRan('');
        setPushups('');
        setBenchPress('');
        setComments('');

      history.push('/');
    } catch (error) {
      console.error('Error deleting status: ', error);
      //alert('Error deleting status!');
    }
  };

  return (
    <div>
      <h2 className="fw-bolder"><center>Update Status</center></h2>

      <div className="container">
        <h4 className="fw-bolder">Update Status here.</h4>
        <form onSubmit={handleUpdate}>
        
            <div className="mb-3">
              <label className="form-label">User</label>
              <input type="text" className="form-control" value={user} onChange={(e) => setUser(e.target.value)} readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Distance Ran (KM)</label>
              <input type="number" step="0.01" className="form-control" value={distanceRan} onChange={(e) => setDistanceRan(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Pushups</label>
              <input type="number" className="form-control" value={pushups} onChange={(e) => setPushups(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Bench Press (KG)</label>
              <input type="number" step="0.01" className="form-control" value={benchPress} onChange={(e) => setBenchPress(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Comments</label>
              <input type="text" className="form-control" value={comments} onChange={(e) => setComments(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Update</button>
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-block mt-2">Delete</button>
        </form>
      </div>
    </div>

        
    
  );
}

export default UpdateStatus;