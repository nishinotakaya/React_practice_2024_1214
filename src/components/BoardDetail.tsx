import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

interface Board {
  id: number
  name: string
  title: string
  body: string
  created_at: string
  updated_at: string
  comments: Comment[]
}

interface Comment {
  id: number
  body: string
  name: string
  created_at: string
}

function BoardDetail() {
  const { id } = useParams<{ id: string }>()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:3306/boards/${id}.json`, {
          headers: {
            'Accept': 'application/json'
          }
        })
        setBoard(response.data)
        setLoading(false)
      } catch (error) {
        console.error('掲示板の詳細取得に失敗しました:', error)
        setLoading(false)
      }
    }

    fetchBoard()
  }, [id])

  if (loading) return <p className="loading">読み込み中...</p>
  if (!board) return <p>掲示板が見つかりません</p>

  return (
    <div className="container">
      <div className="d-flex align-items-center mt-4 mb-4">
        <div className="ml-auto">
          <Link to="/boards" className="btn btn-outline-dark mr-2">
            掲示板一覧
          </Link>
          <button className="btn btn-outline-dark">編集</button>
        </div>
      </div>

      <div className="board-detail">
        <h2>{board.title}</h2>
        <div className="board-info">
          <p>作成者: {board.name}</p>
          <p>作成日時: {new Date(board.created_at).toLocaleString('ja-JP')}</p>
        </div>
        <div className="board-body">
          <p>{board.body}</p>
        </div>
      </div>

      <div className="comments-section mt-4">
        <h3>コメント</h3>
        {board.comments && board.comments.map(comment => (
          <div key={comment.id} className="comment-card">
            <div className="comment-header">
              <span>{comment.name}</span>
              <span>{new Date(comment.created_at).toLocaleString('ja-JP')}</span>
            </div>
            <div className="comment-body">
              {comment.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardDetail