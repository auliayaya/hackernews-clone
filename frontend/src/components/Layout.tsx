import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="text-sm sm:w-[80%] lg:w-[80%] ">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-4">{children}</main>
      <Footer />
    </div>
  )
}
