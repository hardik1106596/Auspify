import { NavLink } from 'react-router-dom';

export default function Sidebar({ role }) {
  const links = role === 'instructor'
    ? [['/dashboard', 'Overview'], ['/dashboard/courses', 'My courses']]
    : role === 'admin'
      ? [['/dashboard', 'Overview'], ['/dashboard/courses', 'Courses'], ['/dashboard/users', 'Users']]
      : [['/dashboard', 'Overview'], ['/learning', 'My learning']];

  return (
    <aside className="sidebar">
      <p className="eyebrow">LEARNING SPACE</p>
      <nav aria-label="Dashboard navigation">
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/dashboard'}>{label}</NavLink>)}
      </nav>
    </aside>
  );
}
