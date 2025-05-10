import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactTyped } from 'react-typed';
import NavBar from '../components/NavBar';
import { FaRunning, FaDumbbell, FaPlus, FaArrowUp, FaCommentDots, FaTasks } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

const AddStatus = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const [description, setDescription] = useState('');
  const [distanceRan, setDistanceRan] = useState('');
  const [pushups, setPushups] = useState('');
  const [benchPress, setBenchPress] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/user/StatusTest', {
        user: storedUserInfo.userName,
        description,
        distanceRan: parseFloat(distanceRan),
        pushups: parseInt(pushups),
        benchPress: parseFloat(benchPress),
        comments: [comments]
      });
      alert('Status posted successfully! 🎉');
      window.location.href = "/myprofile";
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to post status'}`);
    }
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
    padding: '2rem',
    margin: '2rem auto',
    maxWidth: '600px',
    backdropFilter: 'blur(10px)'
  };

  const inputStyle = {
    border: '2px solid #e0f0ff',
    borderRadius: '10px',
    padding: '12px 20px 12px 40px',
    transition: 'all 0.3s ease',
    width: '100%',
    ':focus': {
      borderColor: '#4aa1f3',
      boxShadow: '0 0 8px rgba(74, 161, 243, 0.2)',
      outline: 'none'
    }
  };

  const labelStyle = {
    color: '#2a4e6c',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const iconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#4aa1f3',
    fontSize: '1.2rem'
  };

  return (
    <div style={{ 
      background:'rgba(84, 198, 255, 0.6)',
      minHeight: '100vh',
      paddingBottom: '2rem',
      marginTop: '50px' 
    }}>
      <NavBar/>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ overflow: 'hidden' }}
      >
        <motion.h1 
          variants={itemVariants}
          style={{ 
            padding: '2rem 0 1rem',
            textAlign: 'center',
            color: '#2a4e6c',
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <ReactTyped
            strings={['Share Your Fitness Journey 🌟']}
            typeSpeed={50}
            showCursor={false}
          />
        </motion.h1>

        <motion.div 
          style={formStyle}
          variants={containerVariants}
        >
          <form onSubmit={handleSubmit}>
            {/* Workout Summary */}
            <motion.div variants={itemVariants} className="mb-4 position-relative">
              <label style={labelStyle}>
                <FaDumbbell /> Workout Summary
              </label>
              <div style={iconStyle}><FaCommentDots /></div>
              <textarea
                style={{ ...inputStyle, minHeight: '100px', padding: '12px 20px' }}
                placeholder="Example: Morning Jog - 5KM | Pushups Challenge - 50 reps"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </motion.div>

            {/* Distance Ran */}
            <motion.div variants={itemVariants} className="mb-4 position-relative">
              <label style={labelStyle}>
                <FaRunning /> Distance Ran (KM)
              </label>
              <div style={iconStyle}><FaRunning /></div>
              <input
                type="number"
                step="0.01"
                style={inputStyle}
                value={distanceRan}
                onChange={(e) => setDistanceRan(e.target.value)}
                placeholder="0.00"
                required
              />
            </motion.div>

            {/* Pushups */}
            <motion.div variants={itemVariants} className="mb-4 position-relative">
              <label style={labelStyle}>
                <FaArrowUp /> Pushups Count
              </label>
              <div style={iconStyle}><FaArrowUp /></div>
              <input
                type="number"
                style={inputStyle}
                value={pushups}
                onChange={(e) => setPushups(e.target.value)}
                placeholder="0"
                required
              />
            </motion.div>

            {/* Bench Press */}
            <motion.div variants={itemVariants} className="mb-4 position-relative">
              <label style={labelStyle}>
                <FaDumbbell /> Bench Press (KG)
              </label>
              <div style={iconStyle}><FaDumbbell /></div>
              <input
                type="number"
                step="0.01"
                style={inputStyle}
                value={benchPress}
                onChange={(e) => setBenchPress(e.target.value)}
                placeholder="0.00"
                required
              />
            </motion.div>

            {/* Future Goals */}
            <motion.div variants={itemVariants} className="mb-4 position-relative">
              <label style={labelStyle}>
                <FaTasks /> Future Goals
              </label>
              <div style={iconStyle}><FaTasks /></div>
              <input
                type="text"
                style={inputStyle}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Example: Achieve 100 pushups in one set"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 4px 15px rgba(74, 161, 243, 0.3)'
                }}
                whileTap={{ 
                  scale: 0.95,
                  boxShadow: '0 2px 5px rgba(74, 161, 243, 0.2)'
                }}
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #4aa1f3 0%, #2a4e6c 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                <FaPlus className="me-2" />
                Publish Achievement
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AddStatus;