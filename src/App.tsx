import { AuthProvider } from './context/AuthContext';
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Header from './components/Header';
import MovieInfo from './components/MovieInfo';
import NoMatch from './components/NoMatch';
import Sidebar from './components/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import HallPage from './components/HallAdmin/HallPage';
import BranchPage from './components/BranchAdmin/BranchPage';
import MoviePage from './components/MovieAdmin/MoviePage';
import ShowtimePage from './components/ShowtimeAdmin/ShowtimePage';

function App() {
  const location = useLocation();

  // List of routes where the header should be hidden
  const routesWithoutHeader = ["/signin", "/signup"];

  // Check if the current route is in the list of routes without the header
  const hideHeader = routesWithoutHeader.includes(location.pathname);

  return (
    <div dir='rtl'>

      <AuthProvider>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {!hideHeader &&
            // <Box sx={{ display: 'flex' }}>
            <div>
              <Header />
              <Sidebar />
            </div>
          }
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/admin">
              <Route
                path="branch"
                element={
                  <ProtectedRoute>
                    <BranchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hall"
                element={
                  <ProtectedRoute>
                    <HallPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="movie"
                element={
                  <ProtectedRoute>
                    <MoviePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="showtime"
                element={
                  <ProtectedRoute>
                    <ShowtimePage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <div>user</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <div>search results</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/movie/:movieId"
              element={
                <ProtectedRoute>
                  <MovieInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buy-ticket"
              element={
                <ProtectedRoute>
                  <div>buy ticket page</div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Box>
      </AuthProvider >

    </div >
  );
}

export default App;
