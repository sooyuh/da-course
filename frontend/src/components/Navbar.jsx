import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, BookOpen, Home, Heart, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout, getCurrentUser } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 加载用户信息
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-dark">DataLearn</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium text-dark hover:text-primary transition-colors">
            首页
          </Link>
          <Link to="/projects" className="font-medium text-dark hover:text-primary transition-colors">
            项目
          </Link>
          <Link to="/learning-paths" className="font-medium text-dark hover:text-primary transition-colors">
            学习路径
          </Link>
          <Link to="/personalized-paths" className="font-medium text-dark hover:text-primary transition-colors">
            个性化路径
          </Link>
          <Link to="/resources" className="font-medium text-dark hover:text-primary transition-colors">
            资源中心
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="font-medium text-dark hover:text-primary transition-colors">
                个人中心
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <img 
                    src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20person%20with%20${user.username.charAt(0).toUpperCase()}%20initials%2C%20clean%20background&image_size=square`} 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-light transition-colors">
                    个人中心
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-light transition-colors text-red-600">
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button onClick={handleLogin} className="btn-secondary">
                登录
              </button>
              <button onClick={handleRegister} className="btn-primary">
                注册
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-dark" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium text-dark hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                首页
              </Link>
              <Link 
                to="/projects" 
                className="font-medium text-dark hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                项目
              </Link>
              <Link 
                to="/learning-paths" 
                className="font-medium text-dark hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                学习路径
              </Link>
              <Link 
                to="/personalized-paths" 
                className="font-medium text-dark hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                个性化路径
              </Link>
              <Link 
                to="/resources" 
                className="font-medium text-dark hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                资源中心
              </Link>
              <Link 
                to="/profile" 
                className="font-medium text-dark hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                个人中心
              </Link>
              {user ? (
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="flex items-center space-x-2 p-2">
                    <img 
                      src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20person%20with%20${user.username.charAt(0).toUpperCase()}%20initials%2C%20clean%20background&image_size=square`} 
                      alt="用户头像" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary w-full">
                    退出登录
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <button onClick={handleLogin} className="btn-secondary w-full">
                    登录
                  </button>
                  <button onClick={handleRegister} className="btn-primary w-full">
                    注册
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
    </nav>
  );
};

export default Navbar;