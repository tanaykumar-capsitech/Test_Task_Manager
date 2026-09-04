import axios from "axios"
import { useFormik } from "formik"
import { useState } from "react"
import { useToast } from "../components/CustomToast"
import { useNavigate, useParams } from "react-router-dom"
import { confirm } from "../components/CustomConfirmation"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import swr from "../assets/images.jpg"

const url = import.meta.env.VITE_BACKEND_URL

interface todo {
    id: string,
    projectId: string,
    name: string,
    status: boolean,
    creationTime: string
}

interface project {
    id: string,
    userId: string,
    name: string,
    description: string,
    status: string,
    allTasks: todo[]
}

function Tasks() {
    const { projectId } = useParams<{ projectId: string }>()
    const toast = useToast()
    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.token.value)
    const queryClient = useQueryClient()

    const [updateNo, setUpdateNo] = useState("")
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [month, setMonth] = useState(new Date().getMonth() + 1)

    const LogOut = async () => {
        var confirmation: boolean = await confirm("Do you want to leave")
        if (!confirmation) {
            return
        }
        localStorage.removeItem("token")
        navigate("/")
    }

    const UpdatePage = (increase: boolean) => {
        if (increase) {
            setPage(prev => prev + 1)
        } else {
            setPage(prev => (prev - 1) >= 1 ? prev - 1 : prev)
        }
    }

    // Function to get data
    const GetData = async (): Promise<project> => {
        if (!token) {
            navigate("/")
        }
        console.log(url + `Project/GetProjectDetails?projectId=${projectId}`)
        var response = await axios.get(url + `Project/GetProjectDetails?projectId=${projectId}&&pageNo=${page}&&month=${month}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response)
        return (response.data.result)
    }

    // Function to add task
    const AddTask = async (name: string) => {
        if (name == null || name.trim() === "") {
            setError("*Please enter a task name")
            return
        }
        if (!token) {
            return
        }
        var data = {
            "projectId": projectId,
            "name": name
        }
        console.log(data)
        var response = await axios.post(url + "Task/CreateTask", data, { headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.result)
        formik.resetForm()
        setError("")
        GetData()
    }

    // Function to edit task name
    const EditTask = async (value: todo) => {
        if (!token) {
            return
        }
        if (value.name == null || value.name.trim() === "") {
            setError("Please enter a task name")
            return
        }
        console.log(url + `Task/UpdateName?id=${value.id}&newName=${value.name}`)
        var response = await axios.post(url + `Task/UpdateName?id=${value.id}&newName=${value.name}`, null, { headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.result)
        formik.resetForm()
        setUpdateNo("")
        setError("")
        return
    }

    // Function to do a task
    const DoneTask = async (taskId: string) => {
        if (!token) {
            return
        }
        var response = await axios.post(url + `Task/UpdateStatus?id=${taskId}`, null, { headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.result)
        if (formik.values.id && taskId == formik.values.id) {
            formik.resetForm()
            setUpdateNo("")
        }
        GetData()
    }

    // Function to delete task
    const DeleteTask = async (taskId: string) => {
        if (!token) {
            return
        }
        var confirmation: boolean = await confirm("Are you sure to delete")
        if (!confirmation) {
            return
        }
        if (formik.values.id && taskId == formik.values.id) {
            formik.resetForm()
            setUpdateNo("")
        }
        var response = await axios.post(url + `Task/DeleteTask?id=${taskId}`, null, { headers: { Authorization: `Bearer ${token}` } })
        toast.error(response.data.result)
        GetData()
    }

    // React query to fetch data
    const { data: projectData, isError } = useQuery({
        queryKey: ["projectData", page, month],
        queryFn: GetData
    })

    const mutationAdd = useMutation({
        mutationFn: AddTask,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["projectData"] })
        }
    })

    const mutationEdit = useMutation({
        mutationFn: EditTask,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["projectData"] })
        }
    })

    const mutationDone = useMutation({
        mutationFn: DoneTask,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["projectData"] })
        }
    })

    const mutationDelete = useMutation({
        mutationFn: DeleteTask,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["projectData"] })
        }
    })

    const initialValue: todo = {
        id: "",
        projectId: projectId ?? "",
        name: "",
        status: false,
        creationTime: Date.UTC.toString()
    }

    const formik = useFormik({
        initialValues: initialValue,
        onSubmit: values => {
            if (values.id.trim() == "" || values.id == null) {
                mutationAdd.mutate(values.name)
            }
            else {
                mutationEdit.mutate(values)
            }
        }
    })

    if (isError) {
        console.log("Error happend")
        return (
            <>
                <img src={swr} className="m-auto mt-10" />
            </>
        )
    }

    return (
        <>
            <button onClick={() => LogOut()} className="absolute font-bold text-[18px] border-2 w-20 h-10 rounded right-5 top-5 ease-in-out duration-500 hover:rounded-2xl">Logout</button>
            <button onClick={() => navigate("/projects")} className="absolute font-bold text-[18px] border-2 w-20 h-10 rounded right-30 top-5 ease-in-out duration-500 hover:rounded-2xl">Projects</button>

            <div className="flex justify-center item-start">
                <div className="mt-50 text-left mr-20 px-15 h-[50vh] border-r">
                    <p className="flex flex-col gap-2 justify-between items-start text-[28px] font-bold">
                        {projectData?.name}
                        <p className="text-[18px] ">
                            {projectData?.status == 'Created' ?
                                <div className="rounded bg-green-200 p-1">Created</div>
                                :
                                projectData?.status == 'InProgress' ?
                                    <div className="rounded bg-yellow-200 p-1">In Progress</div>
                                    :
                                    <div className="rounded bg-blue-200 p-1">Done</div>
                            }
                        </p>
                    </p>
                    <p className="mt-5 text-[18px]"><span className="font-bold">About:</span> {projectData?.description}</p>
                    <div className="mt-3 text-[18px]">
                        <label className="font-bold">Month: </label>
                        <select value={month} onChange={(e) => {setMonth(Number(e.target.value))}} className="border rounded-lg">
                            <option value={1} className="outline-none">January</option>
                            <option value={2} className="outline-none">February</option>
                            <option value={3} className="outline-none">March</option>
                            <option value={4} className="outline-none">April</option>
                            <option value={5} className="outline-none">May</option>
                            <option value={6} className="outline-none">June</option>
                            <option value={7} className="outline-none">July</option>
                            <option value={8} className="outline-none">August</option>
                            <option value={9} className="outline-none">September</option>
                            <option value={10} className="outline-none">October</option>
                            <option value={11} className="outline-none">November</option>
                            <option value={12} className="outline-none">December</option>
                        </select>
                    </div>
                </div>

                {/* Adding Form */}
                <div>
                    <div className="mt-50 text-center text-[42px] font-bold">Tasks</div>
                    <form onSubmit={formik.handleSubmit} className="m-auto mt-[25px] p-5 text-center  text-[24px] border w-160 rounded-xl">
                        <label>Task Name: </label>
                        <input name="name" type="text" className="ml-10px my-[5px] px-2 outline rounded" value={formik.values.name} onChange={formik.handleChange}></input><br />

                        <button type="submit" className="mt-5 border w-20 h-10 rounded-lg ease-in-out duration-500 hover:rounded-2xl">{updateNo == null || updateNo.trim() === "" ? "Add" : "Edit"}</button>
                        <p className="mt-5 text-[16px] text-red-500">{error}</p>
                    </form>

                    {/* Data Showing Table */}
                    <table className="m-auto border mt-10 w-200 rounded-xl text-center ">
                        <thead>
                            <tr className="font-bold h-10 border-b">
                                <td>Task Name</td>
                                <td>Status</td>
                                <td>Created On</td>
                                <td>Actions</td>
                            </tr>
                        </thead>

                        <tbody>
                            {projectData?.allTasks?.map((task) => (
                                <tr id={task.id} key={task.id} className="h-10 border-b">
                                    <td>{task.name}</td>
                                    <td>{task.status ? <p>Done</p> : <p>In Progress</p>}</td>
                                    <td>{new Date(task.creationTime).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        {task.status ?
                                            <button className="mx-1 px-1 rounded bg-green-200 hover:bg-green-300" onClick={() => { mutationDone.mutate(task.id) }}>done</button>
                                            :
                                            <button className="mx-1 px-1 rounded bg-yellow-200 hover:bg-yellow-300" onClick={() => { mutationDone.mutate(task.id) }}>do</button>
                                        }
                                        <button className="mx-1 px-1 rounded bg-red-200 hover:bg-red-300" onClick={() => { mutationDelete.mutate(task.id) }}>delete</button>
                                        <button
                                            className="mx-1 px-1 rounded bg-blue-200 hover:bg-blue-300"
                                            onClick={() => {
                                                if (!task.status) {
                                                    if (updateNo == task.id) {
                                                        setUpdateNo("")
                                                        formik.resetForm()
                                                    } else {
                                                        setUpdateNo(task.id)
                                                        formik.setValues({
                                                            id: task.id,
                                                            projectId: task.projectId,
                                                            name: task.name,
                                                            status: task.status,
                                                            creationTime: task.creationTime
                                                        })
                                                    }
                                                }
                                            }}
                                        >
                                            {updateNo != task.id ? 'edit' : 'cancel'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-right font-bold text-[16px]"><span className="cursor-pointer" onClick={() => UpdatePage(false)}>&lt;</span> {page} <span className="cursor-pointer" onClick={() => UpdatePage(true)}>&gt;</span></div>
                </div>
            </div>
        </>
    )
}

export default Tasks
