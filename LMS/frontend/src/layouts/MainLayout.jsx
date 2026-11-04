import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container main-content"><Outlet /></main>
      <footer className="footer">Auspify Learn · Build skills at your own pace.</footer>
    </>
  );
}
