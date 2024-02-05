// File: App.js
import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'; // Import useParams
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import ChatArea from './ChatArea'; // Import the ChatArea component
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                ></Toaster>
            </div>
            <BrowserRouter>
                <RecoilRoot>
                    <Routes>
                        <Route
                            path="/"
                            element={<Home />}
                        ></Route>
                        <Route
                            path="/editor/:roomId"
                            element={<EditorPageWithChat />}
                        ></Route>
                    </Routes>
                </RecoilRoot>
            </BrowserRouter>
        </>
    );
}

const EditorPageWithChat = () => {
    // Extract roomId from the route parameters
    const { roomId } = useParams();

    // Use the initSocket function to initialize the socket connection
    const socket = initSocket();

    return (
        <div>
            {/* Render your EditorPage component */}
            <EditorPage roomId={roomId} socket={socket} />
            
            {/* Render the ChatArea component */}
            <ChatArea roomId={roomId} socket={socket} />
        </div>
    );
};

export default App;
