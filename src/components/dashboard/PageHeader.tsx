import type React from "react"


interface PageHeaderProps {
  title: string
  subtitle: string
  children?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {


  return (
      <div className="mt-2 ml-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">{title}</h1>
          <p className="italic text-gray-600 text-sm">{subtitle}</p>
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
  )
}

export default PageHeader
