import React, {useState, useEffect, forwardRef} from 'react';
import './Post.css';
import {db} from './firebase';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase'

const Post = forwardRef(({postId, user, username , imgURL , caption}, ref) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) =>{
            setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
        return() => {
            unsubscribe();
        };
    },[postId]);

 const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');

 }
    return (
        <div ref={ref} className="post"> 
          <div className="post__header">
            {/* header -> avatar + username */}
             <Avatar className="post__avater" alt={username} src="/broken-image.jpg" /> 

            
            <h3>{username}</h3>

          </div>
             
            <img className="post__img" src={imgURL}/>
             {/* image */}
            
            <h4 className="post__text"> <strong>{username}</strong> {caption} </h4>
             {/* username + caption */}
             <div className="post__comments">
                {
                    comments.map((comment) =>(
                        <p>
                            <strong> {comment.username} </strong> {comment.text}
                        </p>
                    ))
                }
             </div>

            {/* Comment Input Field */}
            {
                user && (
                    <from className="post__commentBox">
                        <input 
                        className="post__input"
                        type="text"
                        placeholder="Add a Comment ..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        />
                        <button 
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                        >Post</button>
                    </from>

                )
            }

        </div>
    )
}
)
export default Post
