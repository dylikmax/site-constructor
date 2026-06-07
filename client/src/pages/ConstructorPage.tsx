import { useEffect } from "react"
import { Field } from "../components/field"
import { Header } from "../components/header"
import { Sidebar } from "../components/sidebar"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../redux"
import { fetchProject } from "../redux/slices/editor.slice"
import { useParams } from "react-router-dom"

export const ConstructorPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams();

  const { isLoading, error } = useSelector((state: RootState) => state.editor)

  useEffect(() => {
    dispatch(fetchProject(id))
  }, [dispatch])

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-gray-900 text-gray-200">Loading...</div>
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-red-400">
        <p className="text-xl font-semibold mb-4">Error</p>
        <p className="text-sm opacity-80">{error}</p>
        <button onClick={() => dispatch(fetchProject(id))} className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
          Repeat
        </button>
      </div>
    )
  }

  return <div className='h-screen flex flex-col text-gray-50 w-full overflow-hidden'>
      <Header/>
      <div className='flex flex-1 w-full relative overflow-hidden'>
        <Sidebar/>
        <Field/>
      </div>
    </div>
}