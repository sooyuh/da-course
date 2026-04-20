import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, CheckSquare, Code, List, ChevronDown, Heart, Share2, Download, MessageSquare, Plus, ThumbsUp, Trash2, Reply } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useProgressStore from '../store/progressStore';
import useAuthStore from '../store/authStore';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionContent, setDiscussionContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const { user } = useAuthStore();
  const { progressList, updateProgress, getProgress } = useProgressStore();

  useEffect(() => {
    // 从API获取项目详情
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await response.json();
        if (!data.error) {
          setProjectDetails(data);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadProgress = async () => {
      if (user) {
        await getProgress();
        const projectProgress = progressList.find(item => item.project_id === parseInt(id));
        if (projectProgress) {
          setProgress(projectProgress.progress);
        }
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/community/discussions/${id}`);
        const data = await response.json();
        if (!data.error) {
          setDiscussions(data);
        }
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    fetchProjectDetails();
    loadProgress();
    fetchDiscussions();
  }, [id, user, progressList, getProgress]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="min-h-screen py-20 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">项目不存在</h2>
          <Link to="/projects" className="btn-primary">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  // 处理进度更新
  const handleProgressChange = async (e) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    if (user) {
      try {
        await updateProgress(parseInt(id), newProgress);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  // 处理创建讨论
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/community/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: discussionTitle,
          content: discussionContent,
          project_id: parseInt(id)
        })
      });
      
      if (response.ok) {
        const newDiscussion = await response.json();
        setDiscussions([newDiscussion, ...discussions]);
        setDiscussionTitle('');
        setDiscussionContent('');
        setShowDiscussionForm(false);
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  // 查看讨论详情
  const handleViewDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/community/discussions/detail/${discussionId}`);
      const data = await response.json();
      if (!data.error) {
        setSelectedDiscussion(data);
      }
    } catch (error) {
      console.error('Error fetching discussion detail:', error);
    }
  };

  // 关闭讨论详情
  const handleCloseDiscussion = () => {
    setSelectedDiscussion(null);
  };

  // 处理添加评论
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/community/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: commentContent,
          discussion_id: selectedDiscussion.id,
          parent_id: replyTo
        })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        if (replyTo) {
          // 更新回复
          const updatedComments = selectedDiscussion.comments.map(comment => {
            if (comment.id === replyTo) {
              return {
                ...comment,
                replies: [...comment.replies, newComment]
              };
            }
            return comment;
          });
          setSelectedDiscussion({ ...selectedDiscussion, comments: updatedComments });
        } else {
          // 添加新评论
          setSelectedDiscussion({ ...selectedDiscussion, comments: [...selectedDiscussion.comments, newComment] });
        }
        setCommentContent('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // 处理点赞讨论
  const handleLikeDiscussion = async (discussionId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/community/discussions/like/${discussionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // 更新讨论列表中的点赞数
        setDiscussions(discussions.map(discussion => {
          if (discussion.id === discussionId) {
            return { ...discussion, likes: data.likes };
          }
          return discussion;
        }));
        // 更新选中的讨论
        if (selectedDiscussion && selectedDiscussion.id === discussionId) {
          setSelectedDiscussion({ ...selectedDiscussion, likes: data.likes });
        }
      }
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  // 处理点赞评论
  const handleLikeComment = async (commentId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/community/comments/like/${commentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // 更新评论树中的点赞数
        const updateCommentLikes = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, likes: data.likes };
            }
            if (comment.replies) {
              return { ...comment, replies: updateCommentLikes(comment.replies) };
            }
            return comment;
          });
        };
        setSelectedDiscussion({ 
          ...selectedDiscussion, 
          comments: updateCommentLikes(selectedDiscussion.comments) 
        });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  // 处理删除讨论
  const handleDeleteDiscussion = async (discussionId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (window.confirm('确定要删除这个讨论吗？')) {
      try {
        const response = await fetch(`http://localhost:5000/api/community/discussions/${discussionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          setDiscussions(discussions.filter(discussion => discussion.id !== discussionId));
          if (selectedDiscussion && selectedDiscussion.id === discussionId) {
            setSelectedDiscussion(null);
          }
        }
      } catch (error) {
        console.error('Error deleting discussion:', error);
      }
    }
  };

  // 处理删除评论
  const handleDeleteComment = async (commentId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (window.confirm('确定要删除这个评论吗？')) {
      try {
        const response = await fetch(`http://localhost:5000/api/community/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          // 从评论树中移除删除的评论
          const removeComment = (comments) => {
            return comments.filter(comment => {
              if (comment.id === commentId) {
                return false;
              }
              if (comment.replies) {
                comment.replies = removeComment(comment.replies);
              }
              return true;
            });
          };
          setSelectedDiscussion({ 
            ...selectedDiscussion, 
            comments: removeComment(selectedDiscussion.comments) 
          });
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-secondary hover:text-primary">首页</Link>
          <ChevronDown className="h-4 w-4 text-secondary transform rotate-[-90deg]" />
          <Link to="/projects" className="text-secondary hover:text-primary">项目</Link>
          <ChevronDown className="h-4 w-4 text-secondary transform rotate-[-90deg]" />
          <span className="text-primary font-medium">{projectDetails.title}</span>
        </div>

        {/* 项目标题和基本信息 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{projectDetails.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${projectDetails.difficulty === '入门' ? 'bg-green-100 text-green-800' : projectDetails.difficulty === '中级' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {projectDetails.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-light text-secondary">
                  {projectDetails.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-light text-secondary">
                  预计时长: {projectDetails.duration}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-light text-secondary">
                  热度: {projectDetails.popularity}%
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">
                <Heart className="h-4 w-4" />
                收藏
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-light">
                <Share2 className="h-4 w-4" />
                分享
              </button>
              <button 
                className="btn-primary"
                onClick={async () => {
                  if (user && progress === 0) {
                    try {
                      await updateProgress(parseInt(id), 10);
                      setProgress(10);
                    } catch (error) {
                      console.error('Error updating progress:', error);
                    }
                  }
                  // 滚动到学习内容
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
              >
                开始学习
              </button>
            </div>
          </div>
          <p className="text-secondary text-lg">{projectDetails.description}</p>
        </div>

        {/* 项目内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 学习目标 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">学习目标</h2>
              </div>
              <ul className="space-y-2">
                {projectDetails.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 核心任务 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">核心任务</h2>
              </div>
              <ol className="space-y-3 list-decimal list-inside">
                {projectDetails.coreTasks.map((task, index) => (
                  <li key={index} className="pl-2">{task}</li>
                ))}
              </ol>
            </section>

            {/* 技术要点 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Code className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">技术要点</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectDetails.technicalPoints.map((point, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm bg-light text-secondary">
                    {point}
                  </span>
                ))}
              </div>
            </section>

            {/* 任务步骤 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <List className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">任务步骤</h2>
              </div>
              <ol className="space-y-3 list-decimal list-inside">
                {projectDetails.taskSteps.map((step, index) => (
                  <li key={index} className="pl-2">{step}</li>
                ))}
              </ol>
            </section>

            {/* 代码示例 */}
            {projectDetails.codeExamples && projectDetails.codeExamples.length > 0 && (
              <section className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">代码示例</h2>
                </div>
                <div className="space-y-6">
                  {projectDetails.codeExamples.map((example, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-medium mb-2">{example.title}</h3>
                      <SyntaxHighlighter language="python" style={docco} showLineNumbers>
                        {example.code}
                      </SyntaxHighlighter>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 数据说明 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">数据说明</h2>
              </div>
              <p className="text-secondary mb-4">{projectDetails.dataDescription}</p>
              {projectDetails.datasetLink && (
                <a 
                  href={projectDetails.datasetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Download className="h-4 w-4" />
                  下载数据集
                </a>
              )}
            </section>

            {/* 拓展思考 */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <List className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">拓展思考</h2>
              </div>
              <ul className="space-y-2">
                {projectDetails.extensionThinking.map((question, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-medium">{index + 1}.</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 项目进度 */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">学习进度</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>完成进度</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-light rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                {user ? (
                  <div>
                    <label htmlFor="progress" className="block text-sm mb-2">更新进度</label>
                    <input
                      type="range"
                      id="progress"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleProgressChange}
                      className="w-full h-2 bg-light rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="text-center py-4 text-secondary">
                    <p>登录后可跟踪学习进度</p>
                    <Link to="/login" className="text-primary hover:underline mt-2 inline-block">
                      立即登录
                    </Link>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>状态</span>
                  <span className={progress >= 100 ? 'text-green-600' : 'text-secondary'}>
                    {progress >= 100 ? '已完成' : '进行中'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>学习时长</span>
                  <span>0小时</span>
                </div>
              </div>
            </div>

            {/* 相关项目 */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">相关项目</h3>
              <div className="space-y-4">
                <Link to="/projects/2" className="block hover:bg-light p-3 rounded-lg transition-colors">
                  <h4 className="font-medium mb-1">用户行为日志分析与漏斗转化</h4>
                  <p className="text-sm text-secondary mb-2">分析用户行为并构建转化漏斗</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">中级</span>
                </Link>
                <Link to="/projects/3" className="block hover:bg-light p-3 rounded-lg transition-colors">
                  <h4 className="font-medium mb-1">商品销售趋势分析与库存预警</h4>
                  <p className="text-sm text-secondary mb-2">分析销售趋势并建立库存预警机制</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">中级</span>
                </Link>
              </div>
            </div>

            {/* 技能标签 */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">技能标签</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-light text-secondary">Python</span>
                <span className="px-3 py-1 rounded-full text-sm bg-light text-secondary">Pandas</span>
                <span className="px-3 py-1 rounded-full text-sm bg-light text-secondary">数据清洗</span>
                <span className="px-3 py-1 rounded-full text-sm bg-light text-secondary">数据质量</span>
                <span className="px-3 py-1 rounded-full text-sm bg-light text-secondary">异常值检测</span>
              </div>
            </div>
          </div>
        </div>

        {/* 社区讨论区 */}
        <section className="mt-12 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">项目讨论</h2>
            </div>
            <button 
              className="flex items-center gap-2 btn-primary"
              onClick={() => setShowDiscussionForm(!showDiscussionForm)}
            >
              <Plus className="h-4 w-4" />
              发起讨论
            </button>
          </div>

          {/* 发起讨论表单 */}
          {showDiscussionForm && (
            <div className="mb-8 p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">发起新讨论</h3>
              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label htmlFor="discussion-title" className="block text-sm font-medium mb-2">标题</label>
                  <input
                    type="text"
                    id="discussion-title"
                    value={discussionTitle}
                    onChange={(e) => setDiscussionTitle(e.target.value)}
                    placeholder="请输入讨论标题"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discussion-content" className="block text-sm font-medium mb-2">内容</label>
                  <textarea
                    id="discussion-content"
                    value={discussionContent}
                    onChange={(e) => setDiscussionContent(e.target.value)}
                    placeholder="请输入讨论内容"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="mr-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-light" onClick={() => setShowDiscussionForm(false)}>
                    取消
                  </button>
                  <button type="submit" className="btn-primary">
                    发布讨论
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 讨论列表 */}
          <div className="space-y-6">
            {discussions.length === 0 ? (
              <div className="text-center py-12 text-secondary">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>还没有讨论，快来发起第一个讨论吧！</p>
              </div>
            ) : (
              discussions.map((discussion) => (
                <div key={discussion.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium cursor-pointer hover:text-primary" onClick={() => handleViewDiscussion(discussion.id)}>
                      {discussion.title}
                    </h3>
                    {user && user.id === discussion.user_id && (
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDiscussion(discussion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-secondary mb-4 line-clamp-2">{discussion.content}</p>
                  <div className="flex justify-between items-center text-sm text-secondary">
                    <div className="flex items-center gap-4">
                      <span>发布者: {discussion.username}</span>
                      <span>{new Date(discussion.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {discussion.comment_count}
                      </span>
                      <button 
                        className="flex items-center gap-1 hover:text-primary"
                        onClick={() => handleLikeDiscussion(discussion.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 讨论详情模态框 */}
        {selectedDiscussion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{selectedDiscussion.title}</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleCloseDiscussion}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-secondary">{selectedDiscussion.content}</p>
                <div className="mt-4 flex justify-between items-center text-sm text-secondary">
                  <div>
                    发布者: {selectedDiscussion.username} • {new Date(selectedDiscussion.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {selectedDiscussion.comments.length}
                    </span>
                    <button 
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => handleLikeDiscussion(selectedDiscussion.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {selectedDiscussion.likes}
                    </button>
                  </div>
                </div>
              </div>

              {/* 评论区 */}
              <div className="p-6">
                <h4 className="text-lg font-medium mb-4">评论 ({selectedDiscussion.comments.length})</h4>
                
                {/* 评论列表 */}
                <div className="space-y-4 mb-6">
                  {selectedDiscussion.comments.length === 0 ? (
                    <div className="text-center py-8 text-secondary">
                      <p>还没有评论，快来发表你的看法吧！</p>
                    </div>
                  ) : (
                    selectedDiscussion.comments.map((comment) => (
                      <div key={comment.id} className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                            {comment.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{comment.username}</h5>
                                <p className="text-sm text-secondary">{new Date(comment.created_at).toLocaleString()}</p>
                              </div>
                              {user && user.id === comment.user_id && (
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <p className="mt-1">{comment.content}</p>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                              <button 
                                className="flex items-center gap-1 text-secondary hover:text-primary"
                                onClick={() => setReplyTo(comment.id)}
                              >
                                <Reply className="h-4 w-4" />
                                回复
                              </button>
                              <button 
                                className="flex items-center gap-1 text-secondary hover:text-primary"
                                onClick={() => handleLikeComment(comment.id)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                {comment.likes}
                              </button>
                            </div>
                            
                            {/* 回复列表 */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                      {reply.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h6 className="font-medium text-sm">{reply.username}</h6>
                                          <p className="text-xs text-secondary">{new Date(reply.created_at).toLocaleString()}</p>
                                        </div>
                                        {user && user.id === reply.user_id && (
                                          <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteComment(reply.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                      <p className="mt-1 text-sm">{reply.content}</p>
                                      <div className="mt-2 flex items-center gap-4 text-xs">
                                        <button 
                                          className="flex items-center gap-1 text-secondary hover:text-primary"
                                          onClick={() => setReplyTo(reply.id)}
                                        >
                                          <Reply className="h-3 w-3" />
                                          回复
                                        </button>
                                        <button 
                                          className="flex items-center gap-1 text-secondary hover:text-primary"
                                          onClick={() => handleLikeComment(reply.id)}
                                        >
                                          <ThumbsUp className="h-3 w-3" />
                                          {reply.likes}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 添加评论 */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium mb-4">{replyTo ? '回复评论' : '发表评论'}</h4>
                  <form onSubmit={handleAddComment} className="space-y-4">
                    <div>
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder={replyTo ? '请输入回复内容' : '请输入评论内容'}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      {replyTo && (
                        <button 
                          type="button" 
                          className="mr-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-light"
                          onClick={() => setReplyTo(null)}
                        >
                          取消回复
                        </button>
                      )}
                      <button type="submit" className="btn-primary">
                        {replyTo ? '回复' : '发表评论'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="mt-8">
          <Link to="/projects" className="flex items-center gap-2 text-primary font-medium">
            <ArrowLeft className="h-4 w-4" />
            返回项目列表
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;