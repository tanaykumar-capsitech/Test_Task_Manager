import { useSelector } from "react-redux"
import { type RootState } from "../app/store"
import axios from "axios"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useToast } from "../components/CustomToast"
import { useNavigate } from "react-router-dom"
import { confirm } from "../components/CustomConfirmation"

const url = import.meta.env.VITE_BACKEND_URL

interface project {
    id: string,
    userId: string,
    name: string,
    description: string,
    status: string
}

function Projects() {
    const toast = useToast()
    const navigate = useNavigate()
    const token = useSelector((state: RootState) => state.token.value)
    const queryClient = useQueryClient()

    const [updateNo, setUpdateNo] = useState("")
    const [error, setError] = useState("")

    const LogOut = async () => {
        var confirmation: boolean = await confirm("Do you want to leave")
        if (!confirmation) {
            return
        }
        localStorage.removeItem("token")
        navigate("/")
    }


    // Function to get projects
    const GetProject = async (): Promise<project[]> => {
        if(!token){
            navigate("/")
        }
        var response = await axios.get(url + `Project/GetAllProjects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return (response.data.result)
    }

    // Function to create project
    const CreateProject = async ({name, description, status}: project) => {
        if(name == null || description == null || status == null || name.trim() == "" || description.trim() == "" || status.trim() == ""){
            setError("Please enter all the fields")
        }

        var data = {
            "name": name,
            "description": description,
            "status": status
        }

        var response = await axios.post(url + `Project/CreateProject`, data, { headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.message)
    }

    // Function to create project
    const UpdateProject = async ({id, name, description, status}: project) => {
        if(name == null || description == null || status == null || name.trim() == "" || description.trim() == "" || status.trim() == ""){
            setError("Please enter all the fields")
        }

        var data = {
            "id": id,
            "name": name,
            "description": description,
            "status": status
        }

        var response = await axios.post(url + `Project/UpdateProject`, data, { headers: { Authorization: `Bearer ${token}` } })
        toast.success(response.data.message)
    }

    // Function to create project
    const DeleteProject = async (id: string) => {
        var confirmation: boolean = await confirm("Are you sure to delete")
        if (!confirmation) {
            return
        }
        var response = await axios.post(url + `Project/DeleteProject?projectId=${id}`, null, { headers: { Authorization: `Bearer ${token}` } })
        toast.error(response.data.message)
    } 

    const { data: projectData } = useQuery({
        queryKey: ["project"],
        queryFn: GetProject
    })

    const mutationCreate = useMutation({
        mutationFn: CreateProject,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["project"] })
            formik.resetForm()
        }
    })

    const mutationUpdate = useMutation({
        mutationFn: UpdateProject,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["project"] })
            formik.resetForm()
            setUpdateNo("")
        }
    })

    const mutationDelete = useMutation({
        mutationFn: DeleteProject,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["project"] })
        }
    })

    const initialValue: project = {
        id: "",
        userId: "",
        name: "",
        description: "",
        status: "Created",
    }

    const formik = useFormik({
        initialValues: initialValue,
        onSubmit: (value: project) => {
            if (value.id == null || value.id.trim() == "") {
                mutationCreate.mutate(value)
            } else {
                mutationUpdate.mutate(value)
            }
        }
    })

    return (
        <>
            <button onClick={() => LogOut()} className="absolute font-bold text-[18px] border-2 w-20 h-10 rounded right-5 top-5 ease-in-out duration-500 hover:rounded-2xl">Logout</button>
            <div className="mt-25 text-center text-[42px] font-bold">Projects</div>

            {/* Adding Form */}
            <form onSubmit={formik.handleSubmit} className="m-auto mt-[25px] p-5 px-10 text-left  text-[24px] border w-160 rounded-xl">
                <label>Project Name: </label>
                <input name="name" type="text" className="ml-10px my-[5px] px-2 outline rounded" value={formik.values.name} onChange={formik.handleChange}></input><br />

                <label>Project Description: </label>
                <input name="description" type="text" className="ml-10px my-[5px] px-2 outline rounded" value={formik.values.description} onChange={formik.handleChange}></input><br />

                <label>Status: </label>
                <select name="status" className="ml-10px my-[5px] px-2 outline rounded" value={formik.values.status} onChange={formik.handleChange}>
                    <option value={'Created'} className="text-[18px]">Created</option>
                    <option value={'InProgress'} className="text-[18px]">In Progress</option>
                    <option value={'Done'} className="text-[18px]">Done</option>
                </select><br />

                <button type="submit" className="mt-5 border w-20 h-10 rounded-lg ease-in-out duration-500 hover:rounded-2xl">{updateNo == null || updateNo.trim() === "" ? "Add" : "Edit"}</button>
                <p className="mt-5 text-[16px] text-red-500">{error}</p>
            </form>

            {/* Data Showing Table */}
            <table className="m-auto border mt-10 w-200 rounded-xl text-center ">
                <thead>
                    <tr className="font-bold h-10 border-b">
                        <td>Project Name</td>
                        <td>Description</td>
                        <td>Status</td>
                        <td>Actions</td>
                    </tr>
                </thead>

                <tbody>
                    {projectData?.map((proj) => (
                        <tr id={proj.id} key={proj.id} className="h-10 border-b">
                            <td className="font-bold cursor-pointer" onClick={() => {sessionStorage.setItem("projectId",proj.id); navigate(`/task/${proj.id}`)}}>{proj.name}</td>
                            <td>{proj.description}</td>
                            <td>
                                {proj.status == 'Created' ?
                                    <button className="mx-1 px-1 rounded bg-green-200">Created</button>
                                    :
                                    proj.status == 'InProgress' ?
                                        <button className="mx-1 px-1 rounded bg-yellow-200">In Progress</button>
                                        :
                                        <button className="mx-1 px-1 rounded bg-blue-200">Done</button>
                                }
                            </td>
                            <td>
                                <button className="mx-1 px-1 rounded bg-red-200 hover:bg-red-300" onClick={() => { mutationDelete.mutate(proj.id) }}>delete</button>
                                <button
                                    className="mx-1 px-1 rounded bg-orange-200 hover:bg-orange-300"
                                    onClick={() => {
                                        if (updateNo == proj.id) {
                                            setUpdateNo("")
                                            formik.resetForm()
                                        } else {
                                            setUpdateNo(proj.id)
                                            formik.setValues({
                                                id: proj.id,
                                                userId: proj.userId,
                                                name: proj.name,
                                                description: proj.description,
                                                status: proj.status
                                            })
                                        }
                                    }}
                                >
                                    {updateNo != proj.id ? 'edit' : 'cancel'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Projects