import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, Button, Container, VStack, HStack, Input, Center } from '@chakra-ui/react'
import Message from './Components/Message'
import { app } from '../src/firebase'
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { query, orderBy, getFirestore, addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
  console.log("login handler runs");
}
const logOutHandler = () => signOut(auth)



function App() {
  const [user, setUser] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const divForScroll = useRef(null)

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp()
      })

      divForScroll.current.scrollIntoView({ behavior: "smooth" })
    }
    catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy('createdAt', 'asc'))
    const unSubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data)
      console.log("data", data);
    });

    const unsubscribeForMessage = onSnapshot(q,
      (snap) => {
        setMessages(snap.docs.map(item => {
          // console.log(item.data());
          const id = item.id
          return { id, ...item.data() };
        }));

      })

    return () => {
      unSubscribe();
      unsubscribeForMessage();
    }
  }, [])
  return (
    <Box bg={'red.50'}>
      {
        user ? (
          <Container h={'100vh'} bg={"white"}>
            <VStack h={'full'} bg={'telegram.100'} paddingY={4}>

              <Button onClick={logOutHandler} w={'full'} colorScheme={'red'}>Logout</Button>
              <VStack h={'full'} w={'full'} bg={'purple.100'} overflowY={'auto'} css={{ "&::-webkit-scrollbar": { display: "none" } }}
>

                {
                  messages.map(item => (
                    <Message key={item.id} text={item.text} uri={item.uri} user={item.uid === user.uid ? "me" : "other"} />
                  ))
                }
                <div ref={divForScroll}></div>
              </VStack>

              <form style={{ width: "100%" }}>
                <HStack>
                  <Input placeholder='Enter a message...' value={message} onChange={(e) => setMessage(e.target.value)}  w={'full'} bg={'white'} />
                  <Button onClick={submitHandler} colorScheme={'purple'}>Send</Button>
                </HStack>

              </form>
            </VStack>
          </Container>
        ) : (
          <VStack h={'100vh'} justifyContent={'Center'} alignItems={'center'} bg={'telegram.200'} >
            <Button onClick={loginHandler} colorScheme={'telegram'} w={'20%'} padding={8} fontSize={'1.3rem'}>Sign in with google</Button>
          </VStack>
        )
      }
    </Box>
  )
}

export default App
