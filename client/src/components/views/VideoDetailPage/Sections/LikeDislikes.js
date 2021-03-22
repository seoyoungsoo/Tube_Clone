import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

  const [Likes, setLikes] = useState(0)
  const [LikeAction, setLikeAction] = useState(null)

  const [DisLikes, setDisLikes] = useState(0)
  const [DisLikeAction, setDisLikeAction] = useState(null)

  let variable = {}

  if(props.video) {
    variable = {
      videoId: props.videoId,
      userId: props.userId
    }
  } else {
    variable = {
      commentId: props.commentId,
      userId: props.userId
    }
  }

  useEffect(() => {
    Axios.post('/api/like/getLikes', variable)
      .then(res => {
        if(res.data.success) {
          
          // 얼마나 많은 좋아요를 받았는지
          setLikes(res.data.likes.length)

          // 내가 이미 좋아요를 눌렀는지
          res.data.likes.map(like => {
            if(like.userId === props.userId) {
              setLikeAction('liked')
            }
          })
        } else {
          alert('좋아요 정보를 가져오지 못했습니다.')
        }
      })
  }, [])

  useEffect(() => {
    Axios.post('/api/like/getDisLikes', variable)
      .then(res => {
        if(res.data.success) {
          
          // 얼마나 많은 싫어요를 받았는지
          setDisLikes(res.data.dislikes.length)

          // 내가 이미 싫어요를 눌렀는지
          res.data.dislikes.map(dislike => {
            if(dislike.userId === props.userId) {
              setDisLikeAction('disliked')
            }
          })
        } else {
          alert('싫어요 정보를 가져오지 못했습니다.')
        }
      })
  }, [])

  const onLike = () => {
    if(LikeAction === null) {
      Axios.post('/api/like/upLike', variable)
        .then(res => {
          if(res.data.success) {
            setLikes(Likes + 1)
            setLikeAction('liked')

            if(DisLikeAction !== null) {
              setDisLikeAction(null)
              setDisLikes(DisLikes - 1)
            }
          } else {
            alert("좋아요를 설정하지 못했습니다.")
          }
        })
    } else {
      Axios.post('/api/like/unLike', variable)
        .then(res => {
          if(res.data.success) {
            setLikes(Likes - 1)
            setLikeAction(null)
          } else {
            alert("좋아요를 설정하지 못했습니다.")
          }
        })
    }
  }

  const onDisLike = () => {
    if(DisLikeAction === null) {
      Axios.post('/api/like/upDisLike', variable)
        .then(res => {
          if(res.data.success) {
            setDisLikes(DisLikes + 1)
            setDisLikeAction('disliked')

            if(LikeAction !== null) {
              setLikeAction(null)
              setLikes(Likes - 1)
            }
          } else {
            alert("싫어요를 설정하지 못했습니다.")
          }
        })
    } else {
      Axios.post('/api/like/unDisLike', variable)
        .then(res => {
          if(res.data.success) {
            setDisLikes(DisLikes - 1)
            setDisLikeAction(null)
          } else {
            alert("싫어요를 설정하지 못했습니다.")
          }
        })
    }
  }

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="like">
          <Icon type="like"
            theme={LikeAction === 'liked'? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
      <span style={{paddingLeft: '8px', cursor: 'auto'}}>{Likes} </span>
      </span>

      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon type="dislike"
            theme={DisLikeAction === 'disliked'? 'filled' : 'outlined'}
            onClick={onDisLike}
          />
        </Tooltip>
      <span style={{paddingLeft: '8px', cursor: 'auto'}}>{DisLikes} </span>
      </span>
    </div>
  )
}

export default LikeDislikes
