import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">DataLearn</span>
            </div>
            <p className="text-gray-400 mb-4">
              专注于Python数据分析实战训练，帮助你掌握数据分析核心技能。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-primary transition-colors">
                  项目
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary transition-colors">
                  个人中心
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  关于我们
                </a>
              </li>
            </ul>
          </div>

          {/* 项目分类 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">项目分类</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  数据清洗
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  用户分析
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  销售分析
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  时间序列预测
                </a>
              </li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-gray-400">
              <li>邮箱: contact@datalearn.com</li>
              <li>电话: +86 123 4567 8910</li>
              <li>地址: 北京市海淀区中关村</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 DataLearn. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;