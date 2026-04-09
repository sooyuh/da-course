import { Link } from 'react-router-dom';
import { Book, Award, User, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-6 w-6" />
              <span className="text-xl font-bold">DataLearn</span>
            </div>
            <p className="text-gray-400">
              基于Python的数据分析在线教育平台，为商务数据分析与应用专业的学生提供完整的学习体系和互动式学习体验。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-green-300 transition-colors">首页</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-green-300 transition-colors">课程中心</Link></li>
              <li><Link to="/achievements" className="text-gray-400 hover:text-green-300 transition-colors">成就中心</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-green-300 transition-colors">个人中心</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contact@datalearn.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>123-456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 DataLearn. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;