import { type FC } from 'react'

import useAuthStore from '@store/use-auth-store'

interface SessionUserAvatarProps {
  logoutText?: string
}

const SessionUserAvatar: FC<SessionUserAvatarProps> = ({ logoutText }) => {
  const { user, logOut } = useAuthStore(state => state)
  return (
  <div className="dropdown sm:dropdown-end">
    <label tabIndex={0} className="avatar placeholder btn btn-circle btn-ghost">
      <div className="w-12 rounded-full bg-neutral text-neutral-content">
        <span>{user?.shortName || user?.initialLetter}</span>
      </div>
    </label>
    <ul tabIndex={0} className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
      <li><a onClick={() => { void logOut() }}>{logoutText}</a></li>
    </ul>
  </div>
  )
}

export default SessionUserAvatar
