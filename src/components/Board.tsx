// src/components/Board.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './index.css'

interface Board {
  id: number
  name: string
  title: string
  body: string
  created_at: string
  updated_at: string
}

function Board() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`http://localhost:3306/boards.json?page=${currentPage}`)
        console.log('APIレスポンス:', response.data)
        setBoards(response.data)
        setLoading(false)
      } catch (error) {
        console.error('掲示板データの取得に失敗しました:', error)
        setLoading(false)
      }
    }

    fetchBoards()
  }, [currentPage])

  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await axios.delete(`http://localhost:3306/boards/${id}`)
        const response = await axios.get(`http://localhost:3306/boards.json?page=${currentPage}`)
        setBoards(response.data)
      } catch (error) {
        console.error('削除に失敗しました:', error)
      }
    }
  }

  return (
    <div className="container">
      <div className="d-flex align-items-center mb-4">
        <h1>掲示板一覧</h1>
        <div className="ml-auto">
          <Link to="/boards/new" className="btn btn-outline-dark">
            新規作成
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : (
        <>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>タイトル</th>
                <th>作成者</th>
                <th>作成日時</th>
                <th>更新日時</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(boards) && boards.map((board) => (
                <tr key={board.id}>
                  <td>{board.id}</td>
                  <td>{board.title}</td>
                  <td>{board.name}</td>
                  <td>{new Date(board.created_at).toLocaleString('ja-JP')}</td>
                  <td>{new Date(board.updated_at).toLocaleString('ja-JP')}</td>
                  <td>
                    <Link
                      to={`/boards/${board.id}`}
                      className="btn btn-outline-dark btn-sm mr-2"
                    >
                      詳細
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(board.id)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-dark mr-2"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              前のページ
            </button>
            <span className="mx-3 align-self-center">ページ: {currentPage}</span>
            <button
              className="btn btn-outline-dark"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              次のページ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Board