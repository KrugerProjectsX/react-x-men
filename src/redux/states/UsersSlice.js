import { createSlice } from "@reduxjs/toolkit";

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";

// add user 
export const addUserToFirestore = createAsyncThunk(
    'users/addUserToFirestore',
    async (user )=>{
      const querySnapshot = await getDocs(
        query(collection(db,'users'), where("email", "==", user.email))
      );

      if(!querySnapshot.empty){
        console.log("error")
        throw new Error("Email existe");
      }
      const addUserRef = await addDoc(collection(db,'users'),user);
        const newUser = { id: addUserRef.id, user };
        return newUser;
    
    }
);

export const validateEmail = createAsyncThunk(
  'users/validateEmail',
  async (email)=>{
    const querySnapshot = await getDocs(
      query(collection(db,'users'), where("email", "==", email))
    );
    console.log("query,")
    console.log(querySnapshot)
    console.log("hace"+!querySnapshot.empty)
      return !querySnapshot.empty;
  
  }
);

export  function getUserId() {
  return JSON.parse(localStorage.getItem('user_logged')) || false;
}
export async function getUserLogged() {
  const userId = getUserId();
  if (userId) {
      const ref = doc(db, "users", userId);
      const dataUser = await getDoc(ref);
      return  {...dataUser.data()};

  }
}
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
        userEmailExiste: false,
      
    },
    
    extraReducers: (builder) => {
      builder
      .addCase(fetchUsers.fulfilled, (state, action) => { 
        state.usersArray = action.payload;
      })
      .addCase(validateEmail.fulfilled, (state, action) => { 
        state.userEmailExiste = action.payload;
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