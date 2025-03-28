import {createBrowserRouter} from 'react-router-dom';
import CheckEmailPage from '../pages/CheckEmailPage';
import MessagePage from '../components/MessagePage';
import CheckPasswordPage from '../pages/CheckPasswordpage';
import Home from '../pages/Home';
import RegisterPage from '../pages/RegisterPage';
import App from '../App';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />, //root component
        children : [
            {
                path : "register",
                element : <RegisterPage />
            },
            {
                path : "email",
                element : <CheckEmailPage />
            },
            {
                path : "password",
                element : <CheckPasswordPage />
            },
            {
                path : "",
                element : <Home />,
                children : [
                    {
                        path : ':userId', //dynamic id
                        element : <MessagePage />
                    }
                ]
            }
        ]
    }
]);

export default router;