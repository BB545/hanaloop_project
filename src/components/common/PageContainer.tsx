type PageContainerProps = {
    children: React.ReactNode
}

const PageContainer = ({children}: PageContainerProps) => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="w-full px-6 py-8">
        {children}
      </div>
    </main>
  )
}

export default PageContainer