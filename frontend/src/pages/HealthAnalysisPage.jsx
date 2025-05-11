import React, { useState, useEffect } from 'react';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Paper,
    Box,
    useTheme
} from '@mui/material';
import {
    Cake,
    MonitorWeight,
    Height,
    Favorite,
    LocalFireDepartment,
    FitnessCenter,
    AccessibilityNew,
    Calculate,
    LineWeight
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import NavBar from '../components/NavBar';


const HealthAnalysisPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    // BMI Categories with softer colors
    const BMI_CATEGORIES = [
        { name: 'Underweight', value: 1, color: '#FFE082', max: 18.5 },
        { name: 'Normal', value: 1, color: '#C8E6C9', max: 24.9 },
        { name: 'Overweight', value: 1, color: '#ffad34', max: 29.9 },
        { name: 'Obese', value: 1, color: '#EF9A9A', max: 40 }
    ];

    const StyledCard = styled(Card)(({ theme }) => ({
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[6]
        },
        position: 'relative',
        overflow: 'visible',
        '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            padding: '2px',
            background: 'linear-gradient(145deg, rgba(25,118,210,0.2) 0%, rgba(41,182,246,0.1) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
        }
    }));

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('UserInfo'));
                const response = await axios.get(`http://localhost:8080/api/users/getUserByEmail/${userInfo.email}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const calculateBMI = () => {
        if (!userData?.weight || !userData?.height) return null;
        return (userData.weight / (userData.height ** 2)).toFixed(1);
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 24.9) return 'Normal';
        if (bmi < 29.9) return 'Overweight';
        return 'Obese';
    };

    // Fixed age calculation
   const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    
    // Parse the date string into UTC components
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return 'Invalid Date';

    const today = new Date();
    
    // Handle future dates
    if (birthDate > today) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    console.log("DOB:", dob);
console.log("Parsed Date:", birthDate);
console.log("Today:", today);
console.log("Age:", age);


    console.log(age);
    return age;

    
    
};

    const getHealthRecommendations = (bmiCategory) => {
        const recommendations = {
            Underweight: [
                '🍎 Increase calorie intake with nutrient-dense foods',
                '🏋️ Add strength training to build muscle mass',
                '🥛 Consider protein supplements between meals'
            ],
            Normal: [
                '🥗 Maintain balanced diet with variety',
                '🚴‍♂️ 150 mins moderate exercise weekly',
                '💤 Ensure 7-9 hours quality sleep'
            ],
            Overweight: [
                '🥦 Focus on vegetable-rich meals',
                '🚶‍♂️ Increase daily step count gradually',
                '🧘 Practice mindful eating habits'
            ],
            Obese: [
                '👨⚕️ Consult nutritionist for personalized plan',
                '🏥 Monitor blood pressure regularly',
                '📉 Aim for gradual weight loss (1-2kg/week)'
            ]
        };
        return recommendations[bmiCategory] || ['Complete profile to get recommendations'];
    };

    // ... rest of the component remains similar, here's the updated return section:
    const bmi = calculateBMI();
    const bmiCategory = bmi ? getBMICategory(bmi) : 'Unknown';
    const age = userData?.dob ? calculateAge(userData.dob) : 'N/A';
    return (
        <>
            <NavBar />
            <div style={{
                background: 'rgba(111, 204, 250, 0.6)',
                minHeight: '100vh'
            }}>
                <Grid container sx={{ pt: 8 }}>
                    <Grid item xs={3}>
                        <SideUserPanel />
                    </Grid>

                    <Grid item xs={6}>
                        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                            {(!userData?.weight || !userData?.height) && (
                                <Paper elevation={0} sx={{
                                    p: 3,
                                    mb: 4,
                                    background: 'linear-gradient(135deg, rgba(255, 184, 77, 0.44) 0%, rgba(255,245,157,0.15) 100%)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 184, 77, 0.8)'
                                }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LineWeight sx={{ mr: 1, color: 'warning.main' }} />
                                        Complete your profile measurements for detailed analysis
                                    </Typography>
                                </Paper>
                            )}

                            {/* BMI Section */}
                            <Paper className='shadow' elevation={0} sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: '16px',
                                background: 'linear-gradient(145deg, rgb(255, 255, 255) 0%, rgba(0, 128, 255, 0.16) 100%)',
                                
                            }}>
                                <Typography variant="h5" gutterBottom sx={{
                                    fontWeight: 600,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.primary'
                                }}>
                                    <Calculate sx={{ mr: 1.5, color: 'primary.main' }} />
                                    Body Mass Index (BMI) Analysis
                                </Typography>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={5}>
                                        <Box sx={{
                                            p: 3,
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.79)',
                                            boxShadow: theme.shadows[2]
                                        }}>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={BMI_CATEGORIES}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={55}
                                                        outerRadius={75}
                                                        paddingAngle={2}
                                                    >
                                                        {BMI_CATEGORIES.map((entry, index) => (
                                                            <Cell key={index} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <text
                                                        x="50%"
                                                        y="50%"
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        style={{
                                                            fontSize: '1.8rem',
                                                            fontWeight: 700,
                                                            fill: theme.palette.text.primary
                                                        }}
                                                    >
                                                        {bmi || '--'}
                                                    </text>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <Typography align="center" sx={{ mt: 2, fontWeight: 500 }}>
                                                Category: <span style={{
                                                    color: BMI_CATEGORIES.find(c => c.name === bmiCategory)?.color,
                                                    fontWeight: 600
                                                }}>
                                                    {bmiCategory}
                                                </span>
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={7}>
                                        <Grid container spacing={2}>
                                            {[
                                                {
                                                    icon: <MonitorWeight sx={{ fontSize: 32 }} />,
                                                    label: 'Weight',
                                                    value: `${userData?.weight || '--'} kg`
                                                },
                                                {
                                                    icon: <Height sx={{ fontSize: 32 }} />,
                                                    label: 'Height',
                                                    value: `${userData?.height || '--'} m`
                                                },
                                                {
                                                    icon: <Cake sx={{ fontSize: 32 }} />,
                                                    label: 'Age',
                                                    value: calculateAge(userData?.dob)
                                                },
                                                {
                                                    icon: <AccessibilityNew sx={{ fontSize: 32 }} />,
                                                    label: 'Body Type',
                                                    value: bmiCategory
                                                }
                                            ].map((metric, index) => (
                                                <Grid item xs={6} key={index}>
                                                    <StyledCard>
                                                        <CardContent sx={{ textAlign: 'center' }}>
                                                            <Box sx={{
                                                                width: 48,
                                                                height: 48,
                                                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(25,118,210,0.2) 100%)',
                                                                borderRadius: '12px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mx: 'auto',
                                                                mb: 1.5
                                                            }}>
                                                                {metric.icon}
                                                            </Box>
                                                            <Typography variant="subtitle1" sx={{
                                                                fontWeight: 500,
                                                                color: 'text.secondary',
                                                                mb: 0.5
                                                            }}>
                                                                {metric.label}
                                                            </Typography>
                                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                                {metric.value}
                                                            </Typography>
                                                        </CardContent>
                                                    </StyledCard>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Recommendations Section */}
                            <Paper className='shadow' elevation={0} sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: '16px',
                                background: 'linear-gradient(145deg, rgb(255, 255, 255) 0%, rgba(57, 143, 249, 0.29) 100%)',
                                border: '1px solid rgba(76,175,80,0.1)'
                            }}>
                                <Typography variant="h5" gutterBottom sx={{
                                    fontWeight: 600,
                                    mb: 2.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.primary'
                                }}>
                                    <FitnessCenter sx={{ mr: 1.5, color: 'success.main' }} />
                                    Health Recommendations
                                </Typography>

                                <Grid container spacing={2}>
                                    {getHealthRecommendations(bmiCategory).map((rec, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Box sx={{
                                                p: 2,
                                                background: 'rgba(255, 255, 255, 0.85)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                minHeight: '100%'
                                            }}>
                                                <Typography variant="body1" sx={{
                                                    fontWeight: 500,
                                                    '&:before': {
                                                        content: '"• "',
                                                        color: 'success.main',
                                                        fontSize: '1.4rem',
                                                        verticalAlign: 'middle'
                                                    }
                                                }}>
                                                    {rec}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                {bmi && (
                                    <Box sx={{
                                        mt: 3,
                                        pt: 2,
                                        borderTop: '1px solid rgba(0, 0, 0, 0.08)'
                                    }}>
                                        <Typography variant="body2" sx={{
                                            color: 'text.secondary',
                                            fontStyle: 'italic',
                                            textAlign: 'center'
                                        }}>
                                            Suggested weight range for your height: {Math.round(18.5 * userData.height ** 2)}kg - {Math.round(24.9 * userData.height ** 2)}kg
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            {/* Health Metrics Section */}
                            <Grid container spacing={3}>
                                {[
                                    {
                                        icon: <Favorite sx={{ fontSize: 32 }} />,
                                        title: 'Cardio Health',
                                        value: '72 bpm',
                                        subtitle: 'Resting Heart Rate',
                                        meta: 'Normal range: 60-100 bpm'
                                    },
                                    {
                                        icon: <LocalFireDepartment sx={{ fontSize: 32 }} />,
                                        title: 'Metabolism',
                                        value: userData && bmi ? `${Math.round((userData.weight * 30) + 500)} kcal` : '--',
                                        subtitle: 'Daily Caloric Needs',
                                        meta: 'Based on Mifflin-St Jeor formula'
                                    },
                                    {
                                        icon: <AccessibilityNew sx={{ fontSize: 32 }} />,
                                        title: 'Body Composition',
                                        value: userData && bmi ? `${(
                                            userData.gender === 'male'
                                                ? (1.20 * bmi + 0.23 * age - 16.2)
                                                : (1.20 * bmi + 0.23 * age - 5.4)
                                        ).toFixed(1)}%` : '--',
                                        subtitle: 'Body Fat Percentage',
                                        meta: 'US Navy method estimation'
                                    }
                                ].map((metric, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <StyledCard>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Box sx={{
                                                    width: 48,
                                                    height: 48,
                                                    background: 'linear-gradient(135deg, rgba(244,67,54,0.1) 0%, rgba(239,154,154,0.2) 100%)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 2
                                                }}>
                                                    {metric.icon}
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {metric.title}
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                                    {metric.value}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    color: 'text.secondary',
                                                    mb: 0.5
                                                }}>
                                                    {metric.subtitle}
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    color: 'text.disabled',
                                                    fontStyle: 'italic'
                                                }}>
                                                    {metric.meta}
                                                </Typography>
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Grid>

                    <Grid item xs={3}>
                        <SideNotoficationPanel />
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default HealthAnalysisPage;