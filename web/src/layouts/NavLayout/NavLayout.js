import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'

const NavLayout = ({ children }) => {
  const { isAuthenticated, logOut } = useAuth()
  return (
    <>
      <div className="mx-auto bg-gray-800 px-4 sm:px-6 lg:px-8 ">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="block h-8 w-auto lg:hidden"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Your Company"
              />
              <img
                className="hidden h-8 w-auto lg:block"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Your Company"
              />
            </div>
            <div>
              <p className="px-4 text-xl font-bold text-slate-50">
                Crownstack Talent LMS
              </p>
            </div>
            {isAuthenticated ? (
              <div className="text-slate-50">
                <button type="button" onClick={logOut}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to={routes.login()} className="text-slate-50">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <main>{children}</main>
    </>
  )
}

export default NavLayout
