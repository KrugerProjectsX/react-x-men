import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Box, Button, TextField } from "@mui/material";
const Messages = ({ flatId }) => {
  const ref = doc(db, "flats", flatId);
  const refMessages = collection(db, "messages");

  const [flat, setFlat] = useState({});
  //type = view | type = create
  const [type, setType] = useState("create");
  const [messages, setMessages] = useState([]);
  const messageInput = useRef("");

  const getMessages = async () => {
    const search = query(refMessages, where("flatId", "==", flatId));
    const dataMessages = await getDocs(search);
    const rows = dataMessages.docs.map((item) => {
      return { ...item.data(), id: item.id };
    });
    setMessages(rows);
  };
  useEffect(() => {
    getMessages();
  }, []);

  const getFlat = async () => {
    const userId = JSON.parse(localStorage.getItem("user_logged"));
    const dataFlat = await getDoc(ref);
    const responseFlat = { ...dataFlat.data() };
    if (responseFlat.user === userId) {
      setType("view");
      await getMessages();
    } else {
      setType("create");
    }
    setFlat(responseFlat);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = messageInput.current.value;
    const data = {
      message: message,
      flatId: flatId,
      userId: JSON.parse(localStorage.getItem("user_logged")),
    };
    await addDoc(refMessages, data);
    getMessages();
  };
  return (
    <div>
      <div className="flex justify-center items-center">
        <h3 className="text-2xl font-bold text-center">Mensajes</h3>
      </div>
      {type === "create" && (
        <>
 <Box
  component={"form"}
  onSubmit={handleSubmit}
  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-200 shadow-md"
>
  <div className="flex flex-col items-center justify-center">
    <TextField
      type={"text"}
      label={"Message"}
      inputRef={messageInput}
      multiline
      maxRows={5}
      minRows={3}
      className="mb-4 w-4/5 md:w-80" 
    />
  </div>
  <div className="flex flex-col items-center justify-center">
    <Button
      type={"submit"}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5 md:w-20" // Para ocupar el 20% en dispositivos pequeños y medianos
    >
      Enviar
    </Button>
  </div>
</Box>
        </>
      )}
      {
        <>
          {messages.map((item) => {
            return (
              <div
                key={item.id}
                className="border p-4 m-4 rounded-full bg-blue-100"
              >
                <p className="text-center">{item.message}</p>
              </div>
            );
          })}
        </>
      }
    </div>
  );
};

export default Messages;
