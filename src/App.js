import './App.css';
import {useState, useEffect} from 'react';
import Post from './Post';
import {db , auth } from './firebase'
import firebase from 'firebase';
import { Modal , Button , Input} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import FlipMove from 'react-flip-move'
function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] =useState([]);
  const [open, setOpen] =useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
 const [user, setUser] = useState(null);
  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has Logged in ...
       console.log(authUser);
       setUser(authUser);
    }else{
      //user has logged out 
      setUser(null);
     }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
     setPosts(snapshot.docs.map(doc =>({
       id: doc.id,
       post: doc.data()
     })));
    })
  }, []);
  const singUp = (event)=> {
        event.preventDefault();

        auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser)=> {
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error) => alert(error.message));

        setOpen(false);
    }

  const singIn = (event) =>{
     event.preventDefault();
      
     auth
     .signInWithEmailAndPassword(email, password);
    //  .ctach((error) => alert(error.message));

     setOpenSignIn(false);
   }

  return (
    <div className="App">

       <Modal 
         open={open}
         onClose={()=> setOpen(false)}
         >
         <div style={modalStyle} className={classes.paper}>
            <from className="app__signup">
                <center> 
                      <img className="app__headerImage"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt=""
                      />
                </center>
                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  placeholder="E-mail"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={singUp} type="submit"> Sing Up </Button>
            </from>
         </div>
       </Modal>

        <Modal 
            open={openSignIn}
            onClose={()=> setOpenSignIn(false)}
            >
            <div style={modalStyle} className={classes.paper}>
                <from className="app__signup">
                    <center> 
                          <img className="app__headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt=""
                          />
                    </center>

                    <Input
                      placeholder="E-mail"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={singIn} type="submit"> Sing In </Button>
                </from>
            </div>
       </Modal>

        <div className="app__header">
           <img className="app__headerImage"
           src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
           alt=""
           />
           {
              user ? (
                   <Button onClick={() =>  auth.signOut()}> Logout</Button> 
              ) : (
              <div className="app__loginContainer">
                  <Button onClick={()=> setOpenSignIn(true)}>Sing in</Button>
                  <Button onClick={() => setOpen(true)}>Sing up</Button>
                  
              </div>
              )
           }
             
              
             
        </div>
       <h1 className="app__h1">Instagram Clone, Leave Post 🙏</h1>
        
        {/* Header */}
        <div className="app__posts">
              <div className="app__postLeft">
                  <FlipMove>
                    {
                      posts.map( ({id, post}) => (
                        <Post key={id} postId={id} user={user} username={post.username} imgURL={post.imgURL} caption={post.caption}/>
                      ))
                    }
                  </FlipMove>
                </div>
                <div className="app__postRight">
                    <InstagramEmbed
                        url='https://www.instagram.com/p/B_uf9dmAGPw/'
                        clientAccessToken='123|456'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                      />
                </div>
        </div>
        {/* <Post username="Siddig Alsadig TitoO" imgURL="" caption=""/>
        <Post username="Jedo BoB" imgURL="" caption=""/> */}
        {/* Posts */}

        {/* Posts */}
        {user?.displayName ? (
            <ImageUpload username={user.displayName} />
         ): (
            <h3> Sorry you need To Login to Upload </h3>
          )}
    </div>

  );
}

export default App;

