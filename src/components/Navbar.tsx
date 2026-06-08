import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { User, LogIn, LogOut, User as UserIcon, Book, Award, UserCircle, Code2 } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6" />
          <span className="text-xl font-bold">DataLearn</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-green-300 transition-colors">首页</Link>
          <Link to="/courses" className="hover:text-green-300 transition-colors">课程中心</Link>
          <Link to="/python-playground" className="flex items-center space-x-1 hover:text-green-300 transition-colors">
            <Code2 className="h-4 w-4" />
            <span>Python练习场</span>
          </Link>
          <Link to="/achievements" className="hover:text-green-300 transition-colors">成就中心</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 hover:text-green-300 transition-colors">
                <UserCircle className="h-5 w-5" />
                <span>{user.email}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-green-300 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>退出</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/auth/login" className="flex items-center space-x-2 hover:text-green-300 transition-colors">
                <LogIn className="h-5 w-5" />
                <span>登录</span>
              </Link>
              <Link to="/auth/register" className="flex items-center space-x-2 hover:text-green-300 transition-colors">
                <User className="h-5 w-5" />
                <span>注册</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;