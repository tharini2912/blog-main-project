import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  deleteDoc,
  deleteField,
  updateDoc,
  where,
} from "firebase/firestore";
import { appDB } from "../firebase/index.js";
import { useUser } from "../Context/UserContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [earlierBlogs, setEarlierBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleTextareaFocus = () => {
    setIsExpanded(true);
  };

  // const handleTextareaBlur = async () => {
  //   setIsExpanded(false);
  // };

  const handleTextareaBlur = (e) => {
    // its a fix save & update button clicking because of animation
    if (e.relatedTarget && !e.relatedTarget.classList.contains("btn-cmn")) {
      setIsExpanded(false);
    }
  };

  const handleSaveClick = async () => {
    const newUniqueId = uuidv4();
    await saveBlog(title, content, createdDate, newUniqueId);
    setTitle("");
    setContent("");
    setCreatedDate("");
    await fetchEarlierBlogs();
  };

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setCreatedDate(blog.createdDate);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { uid: localUID } = useUser();
  console.log("Local UID:", localUID);

  const saveBlog = async (title, content, createdDate, uniqueId) => {
    if (!localUID) {
      console.error("Local UID not found. Cannot save blog.");
      return;
    }

    const userRef = doc(appDB, "users", localUID);
    // find document exist in appDB by using uid
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const blogsRef = collection(userRef, "blogs");
      await addDoc(blogsRef, {
        title,
        content,
        createdDate: new Date(),
        uniqueId,
      });

      console.log("Blog saved successfully!");
    } else {
      console.error("User document not found in Firestore. Cannot save blog.");
    }
  };

  const fetchEarlierBlogs = async () => {
    if (!localUID) {
      console.error("Local UID not found. Cannot fetch earlier blogs.");
      return;
    }
    const userRef = doc(appDB, "users", localUID);
    const blogsRef = collection(userRef, "blogs");
    const querySnapshot = await getDocs(blogsRef);
    const blogsData = [];
    querySnapshot.forEach((doc) => {
      blogsData.push(doc.data());
    });
    setEarlierBlogs(blogsData);
  };
  useEffect(() => {
    // fetch blogs initial mount
    fetchEarlierBlogs();
  }, [localUID]);

  //For Deleting the Blog Entirely actually its a soft deletion

  const handleDeleteClick = async (blogUniqueId) => {
    if (!localUID) {
      console.error("Local UID not found. Cannot update blog.");
      return;
    }
    const userRef = doc(appDB, "users", localUID);
    const blogsRef = collection(userRef, "blogs");
    const blogQuery = query(blogsRef, where("uniqueId", "==", blogUniqueId));
    const querySnapshot = await getDocs(blogQuery);
    if (querySnapshot.empty) {
      console.error("Blog not found in Firestore. Cannot update.");
      return;
    }
    querySnapshot.forEach(async (doc) => {
      // editing the uniqueId to empty string
      await updateDoc(doc.ref, {
        uniqueId: "",
      });

      console.log("Blog updated successfully!");
      // Fetch the latest blogs
      await fetchEarlierBlogs();
    });
  };

  //For Updating Blog Title and Content

  const handleUpdateClick = async (e) => {
    e.preventDefault();
    if (!localUID || !selectedBlog) {
      console.error("Local UID or selected blog not found. Cannot update.");
      return;
    }

    const userRef = doc(appDB, "users", localUID);
    const blogsRef = collection(userRef, "blogs");
    const blogQuery = query(
      blogsRef,
      where("uniqueId", "==", selectedBlog.uniqueId)
    );
    const querySnapshot = await getDocs(blogQuery);
    if (querySnapshot.empty) {
      console.error("Blog not found in appDB. Cannot update.");
      return;
    }
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        title,
        content,
        createdDate: new Date(),
      });
      console.log("Blog updated successfully!");
      // from db fetch
      await fetchEarlierBlogs();
      // for reseting the blog state
      setSelectedBlog(null);
      setTitle("");
      setContent("");
    });
  };

  const formatDateTime = (dateTime) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return `${dateTime.toLocaleDateString()}, ${dateTime.toLocaleTimeString(
      [],
      options
    )}`;
  };

  return (
    <section className={`for-home ${isExpanded ? "expanded" : ""}`}>
      <div className={`text-container ${isExpanded ? "text-container-w" : ""}`}>
        <textarea
          placeholder="Title"
          className={`for-heading ${isExpanded ? "expanded-title" : ""}`}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          // onChange={handleTitleChange}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name=""
          id=""
          cols="30"
          rows="1"
        ></textarea>
        <textarea
          placeholder="Write your Blog here..."
          className={`for-content ${isExpanded ? "expanded" : ""}`}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          // onChange={handleContentChange}
          onChange={(e) => setContent(e.target.value)}
          value={content}
          name=""
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <button
          className="btn-cmn"
          onClick={selectedBlog ? handleUpdateClick : handleSaveClick}
          disabled={!title || !content}
        >
          {selectedBlog ? "Update" : "Save"}
        </button>
      </div>
      <div>
        {earlierBlogs.some((blog) => blog.uniqueId) ? (
          <h2 className="earlier">Earlier Blogs</h2>
        ) : (
          <h2 className="earlier">No Earlier Blogs Found</h2>
        )}
        <br />
        <div className="for-map">
          {earlierBlogs.map(
            (blog) =>
              blog.uniqueId && (
                <div className="map-blog" key={blog.uniqueId}>
                  {console.log(blog.uniqueId)}
                  <h2 className="map-head">{blog.title}</h2>
                  <p className="map-para">{blog.content}</p>
                  <p className="map-createdDate">
                    Created on:{" "}
                    {blog.createdDate
                      ? formatDateTime(blog.createdDate.toDate())
                      : "N/A"}
                  </p>
                  <div className="btn-operation-container">
                    <FaEdit
                      className="clr-btn"
                      onClick={() => handleEditClick(blog)}
                    />
                    <MdDelete
                      className="clr-btn-del"
                      onClick={() => handleDeleteClick(blog.uniqueId)}
                    />
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
