import { createSlice } from "@reduxjs/toolkit";

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";

const ref = collection(db, "flats");
const refFav = collection(db, "favorites");
// add flat to firestore
export const addFlatToFirestore = createAsyncThunk(
    'flats/addFlatToFirestore',
    async (flat)=>{
        const addFlatRef = await addDoc(collection(db,'flats'),flat);
        const newFlat = { id: addFlatRef.id, flat };
        return newFlat;
    }
);

  // get flat 
  export const getFlat = createAsyncThunk(
    'flats/getFlat', 
    async (id) => {
      const ref = doc(db, "flats", id);
      const dataFlat = await getDoc(ref);
      const flat = dataFlat.data();
      return flat;
    }
  );
  
export const myFlats = createAsyncThunk(
  'flats/myFlats',
  async (user) => {
    const search = query(ref, where("user", "==", user));
    const data = await getDocs(search);
    const flats = data.docs.map((item) => {
        return { ...item.data(), id: item.id }
    });

    
    return flats;
  }
);

// fetch flats
export const fetchFlats = createAsyncThunk(
    'flats/fetchFlats',
    async (user) => {
      const data = await getDocs(ref);
      const allFlats = [];
      for(const item of data.docs){
          const search = query( refFav, where("userId", "==",user ), where('flatId','==',item.id));
          const dataFav = await getDocs(search);
          let favorite =false;
          if(dataFav.docs.length > 0){
              favorite = dataFav.docs[0].id;
          }
          const flatsWithFav = {...item.data(), id: item.id, favorite: favorite};
          allFlats.push(flatsWithFav)
      }
      return allFlats;
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
    console.log( editedFlat.id, "idflat")
    const flats = await getDocs(collection(db,'flats'));
    console.log(flats)
    for(let snap of flats.docs){
      if(snap.id === editedFlat.id){
        const flatRef = doc(db,'flats', snap.id);

        await updateDoc(flatRef, editedFlat);
      }
    }
    return editedFlat;
  }
);


// add flatfavorite to firestore
export const favoriteFlat = createAsyncThunk(
  'flats/FavoriteFlat',
  async (user)=>{
    const search = query(refFav, where("userId","==",user ) );
            const data = await getDocs(search);
        
            const allFlats = [];
            for (const item of data.docs){
                const refFlat = doc(db, "flats", item.data().flatId);
                const dataFlat = await getDoc(refFlat);
                allFlats.push({...dataFlat.data(), id: dataFlat.id, favorite: item.id});
            }
           
      return allFlats;
  }
);



  const FlatSlice = createSlice({
    name: 'Flats',
    initialState: {
        flatsArray: [],
        flat:{},
    },
    extraReducers: (builder) => {
      builder
      .addCase(myFlats.fulfilled, (state, action) => { 
        state.flatsArray = action.payload;
      })
      .addCase(getFlat.fulfilled, (state, action) => { 
        state.flat=action.payload;
      })
      .addCase(fetchFlats.fulfilled, (state, action) => { 
        state.flatsArray = action.payload;
      })
      .addCase(favoriteFlat.fulfilled, (state, action) => { 
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