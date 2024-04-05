import { createSlice } from "@reduxjs/toolkit";

import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";

// add flat to firestore
export const addFlatToFirestore = createAsyncThunk(
    'flats/addFlatToFirestore',
    async (flat)=>{
        const addFlatRef = await addDoc(collection(db,'flats'),flat);
        const newFlat = { id: addFlatRef.id, flat };
        return newFlat;
    }
);


export const myFlats = createAsyncThunk(
  'flats/myFlats',
  async (user) => {
    const search = query(collection(db, "flats"), where("user", "==", user));
    const data = await getDocs(search);
    const flats = data.docs.map((doc) => ({
      id: doc.id,
      flat: doc.data(),
    }));
    console.log("Mapped flats:", flats);
    
    return flats;
  }
);

// fetch flats
export const fetchFlats = createAsyncThunk(
    'flats/fetchFlats',
    async () => {
      const querySnapshot = await getDocs(collection(db, 'flats'));
      const flats = querySnapshot.docs.map((doc)=>({
        id: doc.id,
        flat: doc.data(),
      }));
      return flats;
    }
  );

    // delete flat
    export const deleteFlat = createAsyncThunk(
      'flats/deleteFlat',
      async(id)=>{
        const flats = await getDocs(collection(db,'flats'));
        for(let snap of flats.docs){
          if(snap.id === id){
            await deleteDoc(doc(db,'flats',snap.id));
          }
        }
        return id;
      }
    ); 

    // update flat
export const updateFlat=createAsyncThunk(
  'flat/updateflats',
  async(editedFlat)=>{
    const flats = await getDocs(collection(db,'flats'));
    for(let snap of flats.docs){
      if(snap.id === editedFlat.id){
        const flatRef = doc(db,'flats', snap.id);
        await updateDoc(flatRef, editedFlat.flat);
      }
    }
    return editedFlat;
  }
);


  const FlatSlice = createSlice({
    name: 'Flats',
    initialState: {
        flatsArray: [],
        myFlatsArray: [],
    },
    extraReducers: (builder) => {
      builder
      .addCase(myFlats.fulfilled, (state, action) => { 
        state.flatsArray = action.payload;
      })
      .addCase(fetchFlats.fulfilled, (state, action) => { 
        state.flatsArray = action.payload;
      })
      .addCase(addFlatToFirestore.fulfilled, (state, action)=>{
        state.flatsArray.push(action.payload);
      })
      .addCase(deleteFlat.fulfilled,(state,action)=>{        
        state.flatsArray = state.flatsArray.filter((flat)=>flat.id !== action.payload);
      })
      .addCase(updateFlat.fulfilled,(state,action)=>{
        const {id, flat} = action.payload;
        const flatIndex = state.flatsArray.findIndex((flat)=>flat.id === id);
        if(flatIndex !== -1){
          state.flatsArray[flatIndex] = {id: id, flat}
        }
      })
    
    }});
  
    export default FlatSlice.reducer;