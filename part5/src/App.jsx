import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import CreateBlogForm from "./components/CreateBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`Welcome ${user.name}!`);
    } catch (exception) {
      showNotification("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
    showNotification("Logged out successfully");
  };

  const handleLike = async (blog) => {
    debugger;
    try {
      const updatedObject = { likes: (blog.likes ?? 0) + 1 };

      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, likes: updatedObject.likes } : b,
        ),
      );

      const returned = await blogService.update(blog.id, updatedObject);

      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? returned : b)));
    } catch (error) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, likes: blog.likes ?? 0 } : b,
        ),
      );
      showNotification("Failed to like the blog", "error");
      console.error("handleLike error", error);
    }
  };

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs((prev) => [...prev, returnedBlog]);
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      );
    } catch {
      showNotification("failed to add blog", "error");
    }
  };

  const handleDelete = async (blog) => {
    deleteButton.addEventListener("click", () => {
      if (window.confirm("Do you want to delete the post?")) {
        blogService.remove(blog);
      } else {
        alert.innerText = "OK, we wont delete it ;)!";
      }
    });
  };

  const Notification = ({ notification }) => {
    if (!notification) return null;
    const style = {
      color: notification.type === "error" ? "red" : "green",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };
    return <div style={style}>{notification.message}</div>;
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <CreateBlogForm createBlog={createBlog} />

      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={() => handleLike(blog)}
            onDelete={() => handleDelete(blog)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
