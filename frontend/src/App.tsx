import { Route, Routes } from "react-router-dom"
import Tasks from "./Pages/Tasks"
import Login from "./Pages/Login"
import Projects from "./Pages/Projects"

function App() {
  

  return (
    <div>
      <Routes>
        <Route element={<Login/>} path={"/"}></Route>
        <Route element={<Projects/>} path={"/projects"}></Route>
        <Route element={<Tasks/>} path={"/task/:projectId"}></Route>
      </Routes>
    </div>
  )
}

export default App
