import axios from "axios"
import { useFormik } from "formik"
import { useToast } from "../components/CustomToast"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../app/store"
import { setToken } from "../feature/token/tokenSlice"
import { useEffect, useState } from "react"
import { Spinner } from "@fluentui/react-components"

const url = import.meta.env.VITE_BACKEND_URL

interface LoginInfo {
    email: string,
    password: string
}

function Login() {
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch<AppDispatch>()

    const toast = useToast()
    const navigete = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigete("/projects")
        }
    }, [])

    const LoginUser = async (username: string, password: string) => {
        if (username.trim() == "" || username == null || password.trim() == "" || password == null) {
            setError("Please enter all the fields")
            return
        }
        setFetching(true)
        try {
            setError("")
            var response = await axios.post(url + "Auth/Login", {
                "userName": username,
                "password": password
            })
            console.log(response.data)
            if (response.data.status == true) {
                toast.success("User " + response.data.result.name + " logged in successfully")
                localStorage.setItem("token", response.data.result.token)
                dispatch(setToken(response.data.result.token))
                navigete("/projects")
            } else {
                setFetching(false)
                setError("In valid username or password")
            }
        }
        catch (error) {
            setFetching(false)
            toast.error("An Error Occured")
            console.log(error)
        }
    }

    const initialValue: LoginInfo = {
        email: "",
        password: "welcome"
    }

    const formik = useFormik({
        initialValues: initialValue,
        onSubmit: values => {
            LoginUser(values.email, values.password)
        }
    })
    return (
        <>
            <div className="text-center text-[42px] font-bold mt-50">Login Form</div>
            <form onSubmit={formik.handleSubmit} className="m-auto mt-[35px] p-5 text-center  text-[24px] border w-160 rounded-xl">
                <label>User Email: </label>
                <input name="email" type="text" className="ml-10px my-[5px] px-2 outline rounded" value={formik.values.email} onChange={formik.handleChange}></input><br />
                <label>User Password: </label>
                <input name="password" type="text" className="ml-10px my-[5px] px-2 outline rounded" value={formik.values.password} onChange={formik.handleChange}></input><br />


                <button type="submit" className="mt-5 border w-20 h-10 rounded hover:bg-gray-100 ease-in-out duration-500 hover:rounded-2xl">{fetching ? <Spinner /> : "Login"}</button>
                <div className="mt-5 text-[red] text-[16px]">{error}</div>
            </form>
        </>
    )
}

export default Login