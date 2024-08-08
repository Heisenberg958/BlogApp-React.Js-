import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/blogposts')
      .then(response => {
        setBlogPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      axios.put(`http://localhost:3001/blogposts/${id}`, { title, content })
        .then(response => {
          setBlogPosts(blogPosts.map(post => post.id === id ? response.data : post));
          setTitle('');
          setContent('');
          setIsEditing(false);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      axios.post('http://localhost:3001/blogposts', { title, content })
        .then(response => {
          setBlogPosts([...blogPosts, response.data]);
          setTitle('');
          setContent('');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/blogposts/${id}`)
      .then(() => {
        setBlogPosts(blogPosts.filter(post => post.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setId(post.id);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/30 backdrop-blur-lg rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-white">Blog App</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="block w-full p-2 mb-2 bg-white/70 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Content"
            className="block w-full p-2 mb-2 bg-white/70 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </form>
        <ul className="mt-4">
          {blogPosts.map((post) => (
            <li key={post.id} className="mb-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p>{post.content}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
