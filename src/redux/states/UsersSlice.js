import { createSlice } from "@reduxjs/toolkit";

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";

// add user to firestore
export const addUserToFirestore = createAsyncThunk(
    'users/addUserToFirestore',
    async (user)=>{
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

const UserSlice = createSlice({
    name: 'Users',
    initialState: {
        usersArray: [],
        error: null,
        isLoading: false,
    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchUsers.fulfilled, (state, action) => { 
        state.usersArray = action.payload;
      })
      .addCase(addUserToFirestore.fulfilled, (state, action)=>{
        state.usersArray.push(action.payload);
      })    
    }});
    /** 
    extraReducers: (builder) => {
        builder
          .addCase(fetchBooks.fulfilled, (state, action) => {
            state.booksArray = action.payload;
          })
          .addCase(addUserToFirestore.fulfilled, (state, action)=>{
            state.booksArray.push(action.payload);
          })
          .addCase(deleteBook.fulfilled,(state,action)=>{
            state.booksArray = state.booksArray.filter((book)=>book.id !== action.payload);
          })
          .addCase(deleteAllBooks.fulfilled,(state,action)=>{
            state.booksArray = action.payload;
          })
          .addCase(updateBook.fulfilled,(state,action)=>{
            const {id, book} = action.payload;
            const bookIndex = state.booksArray.findIndex((book)=>book.id === id);
            if(bookIndex !== -1){
              state.booksArray[bookIndex] = {id: id, book}
            }
          })
      }*/

export default UserSlice.reducer;