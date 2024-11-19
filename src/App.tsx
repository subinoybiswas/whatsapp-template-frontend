import './App.css'
import TemplateEditor from './components/page/template-editor'
import PreviewSection from './components/page/preview-section'

function App() {
  return (
    <div className="container mx-auto p-4 space-y-6 w-screen max-w-screen-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TemplateEditor />
        <PreviewSection />
      </div>
    </div>
  )
}

export default App
