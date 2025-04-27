import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import UserRegisterPage from './pages/UserRegisterPage';
import PublicRoutes from './components/PrivateRoutes/PublicRoutes';
import UserLoginPage from './pages/UserLoginPage';
import ProfilePage from './pages/ProfilePage';
import ViewProfilePage from './pages/ViewProfilePage';
import UserSearchPage from './pages/UserSearchPage';
import WorkoutPlanTemplate from './pages/WorkoutPlanTemplate';
import WorkoutPlanPostView from './pages/WorkoutPlanPostView';
import Test from './components/Test';
import { Toaster } from 'react-hot-toast';
import AddMealPlanPage from './pages/AddMealPlanPage';
import AllMealPlanPage from './pages/AllMealPlanPage';
import UpdateMealPlanPage from './pages/UpdateMealPlanPage';
import MealPlanView from './pages/MealPlanView';
import AddStatus from './pages/AddStatus';
import AllStatus from './pages/AllStatus';
//import UpdateStatus from './pages/UpdateStatus';
import UpdateStatusPage from './pages/UpdateStatusPage';
import StatusAllSingleUser from './pages/StatusAllSingleUser';
import UserPrivateRoute from './components/PrivateRoutes/UserPrivateRoute';
import StatusEdit from './pages/StatusEdit';
import HomeWorkoutPlans from './pages/HomeWorkoutPlans';
import HomeMeaalPlans from './pages/HomeMealPlans';

function App() {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          {/*Public Routes*/}
          <Route path="" element={<PublicRoutes />}>
            <Route path="/register" element={<UserRegisterPage />} />
            <Route path="/login" element={<UserLoginPage />} />
          </Route>

          {/*User Routes*/}
          <Route path="" element={<UserPrivateRoute />}>
            <Route index={true} path="/" element={<HomePage />} />
            <Route path="/WorkoutPlans" element={<HomeWorkoutPlans />} />
            <Route path="/HomeMealPlans" element={<HomeMeaalPlans />} />
            <Route path="/test" element={<Test />} />
            <Route path="/myprofile" element={<ProfilePage />} />
            <Route path="/viewprofile/:id/:id2" element={<ViewProfilePage />} />
            <Route path="/usersearch" element={<UserSearchPage />} />

            <Route
              path="/workoutPlanTemplate"
              element={<WorkoutPlanTemplate />}
            />
            <Route
              path="/WorkoutPlanPostView/:id"
              element={<WorkoutPlanPostView />}
            />
            <Route
              path="/WorkoutPlanPostView/:id"
              element={<WorkoutPlanPostView />}
            />

            <Route path="/mealplan" element={<AddMealPlanPage />} />
            <Route path="/mealplan/read" element={<AllMealPlanPage />} />
            <Route
              path="/mealplan/read/update/:mealplanId"
              element={<UpdateMealPlanPage />}
            />
            <Route
              path="/mealplan/read/view/:mealplanId"
              element={<MealPlanView />}
            />

            <Route path="/AddStatus" element={<AddStatus />} />
            <Route path="/AllStatus" element={<AllStatus />} />
            <Route
              path="/StatusAllSingleUser"
              element={<StatusAllSingleUser />}
            />
            <Route
              path="/UpdateStatusPage/:id"
              element={<UpdateStatusPage />}
            />
            <Route path="/StatusEdit/:id" element={<StatusEdit />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
