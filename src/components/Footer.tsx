import { Link } from 'react-router-dom';
import { Book, Award, User, Mail, Phone, Github, Twitter, Linkedin, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Book className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DataLearn
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              基于Python的数据分析在线教育平台，为商务数据分析与应用专业的学生提供完整的学习体系和互动式学习体验。
            </p>
            <div className="flex items-center space-x-3 pt-4">
              {[Github, Twitter, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              <span>快速链接</span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: '首页', href: '/' },
                { name: '课程中心', href: '/courses' },
                { name: 'Python练习场', href: '/python-playground' },
                { name: '成就中心', href: '/achievements' },
                { name: '个人中心', href: '/profile' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-0 h-0.5 bg-blue-500 group-hover:w-4 transition-all duration-300"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
              <span>学习资源</span>
            </h3>
            <ul className="space-y-3">
              {['Python基础教程', '数据分析实战', '机器学习入门', '数据可视化', '项目案例库'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all duration-300"></span>
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
              <span>联系我们</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">contact@datalearn.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-sm">400-123-4567</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">订阅我们的最新动态</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="输入邮箱"
                  className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-r-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>© 2026 DataLearn.</span>
            <span>保留所有权利。</span>
            <span className="flex items-center ml-2">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1 animate-pulse" /> in China
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
            <a href="#" className="hover:text-white transition-colors">帮助中心</a>
          </div>
          
          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-110"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
