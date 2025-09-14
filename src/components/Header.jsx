// src/components/Header.jsx
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline'

const Header = ({ toggleSidebar, alertsCount }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <h1 className="ml-2 md:ml-0 text-xl font-semibold">Fire Alert Dashboard</h1>
        </div>
        
        <div className="flex items-center">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
            <BellIcon className="h-6 w-6" />
            {alertsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alertsCount}
              </span>
            )}
          </button>
          
          <div className="ml-4 flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              AD
            </div>
            <span className="ml-2 text-sm font-medium hidden md:block">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header