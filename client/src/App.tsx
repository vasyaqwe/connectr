import { Navigate, Route, Routes } from "react-router-dom"
import { PersistLogin } from "./wrappers/PersistLogin"
import { Home } from "./pages/Home"
import { Layout } from "./layout/Layout"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/signUp/SignUp"
import { PostDetails } from "./pages/PostDetails"
import { UserProfile } from "./pages/UserProfile"

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Layout />}
            >
                <Route
                    path="signup"
                    element={<SignUp />}
                />
                <Route
                    path="login"
                    element={<Login />}
                />

                <Route element={<PersistLogin />}>
                    <Route
                        index
                        element={<Home />}
                    />
                    <Route
                        path="/posts/:id"
                        element={<PostDetails />}
                    />
                    <Route
                        path="/users/:id"
                        element={<UserProfile />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to={"/"} />}
                />
            </Route>
        </Routes>
    )
}

export default App
