import { AuthProvider } from './context/AuthContext';
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './components/SignIn';
import Home from './components/Home';

function App() {
  return (
    <div dir='rtl'>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
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
                  <div>brnach page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="hall"
              element={
                <ProtectedRoute>
                  <div>hall page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="movie"
              element={
                <ProtectedRoute>
                  <div>movie page</div>
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
            path="/movie"
            element={
              <ProtectedRoute>
                <div>movie info</div>
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
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
