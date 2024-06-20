import '@mantine/core/styles.css';
import './App.css'
import { MantineProvider } from '@mantine/core';
import Header from './components/pageSections/Header'
import Footer from './components/pageSections/Footer'
import { Route, Routes } from 'react-router-dom'
import Boards from './components/pages/Boards'
import Posts from './components/pages/Posts'
import AuthButtons from './components/pageSections/AuthButtons';
import { useAuth } from './hooks';
import UserButtons from './components/pageSections/UserButtons';


const App = () => {
  const [user, setToken, logout] = useAuth();

  return (
    <MantineProvider>
      <Header />
      {user != null ?
        <UserButtons user={user} logout={logout} />
        :
        <AuthButtons setToken={setToken} />
      }
      <Routes>
        <Route index element={<Boards />} />
        <Route path="Kudos-Board/:boardId/posts" element={<Posts />} />
      </Routes>
      <Footer />
    </MantineProvider>
  )
}

export default App
