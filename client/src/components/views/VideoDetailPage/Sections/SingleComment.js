import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import { useSelector } from 'react-redux'
import Axios from 'axios'

const { TextArea } = Input

function SingleComment(props) {

  const videoId = props.postId
  const user = useSelector(state => state.user)
  const [OpenReply, setOpenReply] = useState(false)
  const [CommentValue, setCommentValue] = useState("")

  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value)
  }

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const variable = {
      content: CommentValue,
      writer: user.userData._id,
      postId: videoId,
      responseTo: props.comment._id
    }

    Axios.post('/api/comment/saveComment', variable)
      .then(res => {
        if(res.data.success) {
          setCommentValue("")
          setOpenReply(false)
          props.refreshFunction(res.data.result)
        } else {
          alert("댓글 입력에 실패했습니다.")
        }
      })
  }

  const actions = [
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
  ]

  return (
    <div>
      <Comment 
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p>{props.comment.content}</p>}
      />

      {OpenReply &&
        <form style={{display: 'flex'}} onSubmit={onSubmit} >
          <TextArea
            style={{width: '100%', borderRadius: '5px'}}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="댓글을 작성해주세요."
          />
          <br />
          <Button style={{width: '20%', height: '52px'}} onClick={onSubmit}>Submit</Button>
        </form>
      }

    </div>
  )
}

export default SingleComment
