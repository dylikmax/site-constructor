import { Header } from './components/header'
import { Sidebar } from './components/sidebar'
import { Field } from './components/field'

function App() {

  return <div className='h-screen flex flex-col text-gray-50'>
    <Header/>
    <div className='flex flex-1 overflow-y-auto'>
      <Sidebar/>
      <Field/>
    </div>
  </div>
}

export default App
