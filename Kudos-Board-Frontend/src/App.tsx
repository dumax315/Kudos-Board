import './App.css'
import Header from './components/pageSections/Header'
import Footer from './components/pageSections/Footer'
import { Route, Routes } from 'react-router-dom'
import Boards from './components/pages/Boards'
import Posts from './components/pages/Posts'


const App = () => {

  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Boards />} />
        <Route path="Kudos-Board/:boardId/posts" element={<Posts />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
