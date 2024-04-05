import { createSlice } from "@reduxjs/toolkit";

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";

// add user 
export const addUserToFirestore = createAsyncThunk(
    'users/addUserToFirestore',
    async (user, )=>{

    
        const addUserRef = await addDoc(collection(db,'users'),user);
        const newUser = { id: addUserRef.id, user };
        return newUser;
    
    }
);

// fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers', 
  async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map((doc)=>({
      id: doc.id,
      user: doc.data(),
    }));
    return users;
  }
);

 // update user
 export const updateUser=createAsyncThunk(
  'user/updateUsers',
  async(editedUser)=>{
    const users = await getDocs(collection(db,'users'));
    for(let snap of users.docs){
      if(snap.id === editedUser.id){
        const usersRef = doc(db,'users', snap.id);
        await updateDoc(usersRef, editedUser.user);
      }
    }
    return editedUser;
  }
);

    // delete flat
    export const deleteUser = createAsyncThunk(
      'users/deleteUser',
      async(id)=>{
        const users = await getDocs(collection(db,'users'));
        for(let snap of users.docs){
          if(snap.id === id){
            await deleteDoc(doc(db,'users',snap.id));
          }
        }
        return id;
      }
    );

const UserSlice = createSlice({
    name: 'Users',
    initialState: {
        usersArray: [],
      
    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchUsers.fulfilled, (state, action) => { 
        state.usersArray = action.payload;
      })
      .addCase(addUserToFirestore.fulfilled, (state, action)=>{
        state.usersArray.push(action.payload);
      })    
      .addCase(deleteUser.fulfilled,(state,action)=>{        
        state.usersArray = state.usersArray.filter((user)=>user.id !== action.payload);
      })
      .addCase(updateUser.fulfilled,(state,action)=>{
        const {id, flat} = action.payload;
        const userIndex = state.usersArray.findIndex((user)=>user.id === id);
        if(userIndex !== -1){
          state.usersArray[userIndex] = {id: id, user}
        }
      })
    }});
  

export default UserSlice.reducer;