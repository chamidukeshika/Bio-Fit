import React, { useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import UserLoginPageStyle from '../styles/UserLoginPageStyle.module.css'
import EmptyMenuBar from '../components/EmptyMenuBar';
import axios from 'axios';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { auth, provider } from '../Config/FireBaseConfig.js';
import { signInWithPopup } from 'firebase/auth';
import { CheckCircle } from "lucide-react";

const UserLoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState("")
    const navigate = useNavigate();

    const submitHandler = () => {

        const loginDto = {
            email,
            password
        };
        console.log(loginDto);
        axios.post('http://localhost:8080/api/users/login', loginDto)
            .then(response => {
                console.log("Form submitted successfully!" + response);
                console.log(response);
                const userData = JSON.stringify(response.data);
                localStorage.setItem("UserInfo", userData);

                navigate("/");
            })
            .catch(error => {
                console.error("Error:", error.response.data);
                if (error.response.data == "Password Incorrect") {
                    toast.error("Password Incorrect", {
                        style: {
                            background: "green",
                        }
                    })
                }
                else if (error.response.data == "User not found") {
                    toast.error("You haven't sign up")
                }
            });
    }

    const googleSignUpClick = async () => {
        signInWithPopup(auth, provider).then((data) => {
            console.log(data.user.email);
            const gUser = {
                name: data.user.displayName,
                userName: data.user.email,
                email: data.user.email,
                profileImageUrl: data.user.photoURL
            };

            axios.post('http://localhost:8080/api/users/googleSignUp', gUser)
                .then(response => {
                    toast.success("Successfully Loged in.");
                    setIsLoading(false)
                    const userData = JSON.stringify(response.data);
                    localStorage.setItem("UserInfo", userData);
                    navigate("/");

                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })
    }

    return (
        <div className={UserLoginPageStyle.bodyDiv}>
            <EmptyMenuBar />
            <Container>
                <Row className={UserLoginPageStyle.rowDiv}>
                    <Col md={6} className={UserLoginPageStyle.leftDiv}>
                        <div className={UserLoginPageStyle.contentWrapper}>
                            <h1 className={UserLoginPageStyle.welcomeText}>Welcome to BioFit</h1>
                            <p className={UserLoginPageStyle.tagline}>
                                Transform your fitness journey with our community
                            </p>
                            <ul className={UserLoginPageStyle.featureList}>
                                {[
                                    "Track your workouts",
                                    "Connect with firends",
                                    "Find meal plans",
                                ].map((feature, index) => (
                                    <li key={index} className={UserLoginPageStyle.featureItem}>
                                        <CheckCircle className={UserLoginPageStyle.featureIcon} 
                                                    size={24} 
                                                    color="#4CAF50" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>

                    <Col md={6} className={UserLoginPageStyle.rightDiv}>
                        <h2 className={UserLoginPageStyle.formTitle}>Sign In</h2>

                        <Form>
                            <Form.Group controlId="formEmail">
                                <Form.Label className="mb-2 d-block">Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    className={UserLoginPageStyle.inputField}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label className="mb-2 d-block">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    className={UserLoginPageStyle.inputField}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                className={UserLoginPageStyle.submitButton}
                                onClick={submitHandler}
                                disabled={!email || !password}
                                fullWidth
                            >
                                Sign In
                            </Button>

                            <div className="text-center mt-4">
                                <span className="text-muted">New user? </span>
                                <a href="/register" className={UserLoginPageStyle.linkText}>
                                    Create Account
                                </a>
                            </div>

                            <div className={UserLoginPageStyle.divider}>
                                Or continue with
                            </div>

                            <Button
                                className={UserLoginPageStyle.googleButton}
                                fullWidth
                                onClick={googleSignUpClick}
                                startIcon={<img src="/src/assets/images/googleLogo.png" 
                                              alt="Google" 
                                              width="20" />}
                            >
                                Sign in with Google
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserLoginPage
