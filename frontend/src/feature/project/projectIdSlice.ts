import { createSlice } from "@reduxjs/toolkit";

export const projectIdSlice = createSlice({
    name: 'projectId',
    initialState: {
        value: ""
    },
    reducers: {
        updateProjectId: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { updateProjectId } = projectIdSlice.actions
export default projectIdSlice.reducer