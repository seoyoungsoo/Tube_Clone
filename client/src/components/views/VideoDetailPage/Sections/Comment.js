import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import { Avatar, Button, Input } from 'antd'

const { TextArea } = Input

function Comment(props) {

  const videoId = props.postId
  const user = useSelector(state => state.user)
  const [commentValue, setcommentValue] = useState("")

  const handleClick = (event) => {
    setcommentValue(event.currentTarget.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const variable = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId
    }

    Axios.post('/api/comment/saveComment', variable)
      .then(res => {
        if(res.data.success) {
          setcommentValue("")
          props.refreshFunction(res.data.result)
        } else {
          alert("댓글 입력에 실패했습니다.")
        }
      })
  }

  return (
    <div>
      <br />
      <p> Replies</p>
      <hr />

      {/* Comment Lists */}

      {props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.responseTo &&
          <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}/>  
        )
      ))}

      {/* Root Comment Form */}

      <form style={{display: 'flex'}} onSubmit={onSubmit} >
        <TextArea
          style={{width: '100%', borderRadius: '5px'}}
          onChange={handleClick}
          value={commentValue}
          placeholder="댓글을 작성해주세요."
        />
        <br />
        <Button style={{width: '20%', height: '52px'}} onClick={onSubmit}>Submit</Button>
      </form>
    </div>
  )
}

export default Comment
