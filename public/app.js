const API_URL = 'http://localhost:3000/blogs';

async function fetchPosts() {
    const response = await fetch(API_URL);
    const blogs = await response.json();
    
    const list = document.getElementById('blog-list');
    list.innerHTML = ''; 

    blogs.forEach(blog => {
        const postDiv = document.createElement('div');
        postDiv.className = 'blog-post';
        postDiv.innerHTML = `
            <div class="blog-header">
                <h3>${blog.title}</h3>
                <div>
                    <button class="edit" onclick="editPost('${blog._id}', '${escape(blog.title)}', '${escape(blog.author)}', '${escape(blog.body)}')">Edit</button>
                    <button class="delete" onclick="deletePost('${blog._id}')">Delete</button>
                </div>
            </div>
            <small>By ${blog.author} | ${new Date(blog.createdAt).toLocaleDateString()}</small>
            <p>${blog.body}</p>
        `;
        list.appendChild(postDiv);
    });
}

async function savePost() {
    const id = document.getElementById('post-id').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = document.getElementById('body').value;

    if (!title || !body) {
        alert('Title and Body are required!');
        return;
    }

    const data = { title, body, author: author || 'Anonymous' };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            resetForm();
            fetchPosts(); 
        } else {
            alert('Error saving post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchPosts();
    }
}

function editPost(id, title, author, body) {
    document.getElementById('post-id').value = id;
    document.getElementById('title').value = unescape(title);
    document.getElementById('author').value = unescape(author);
    document.getElementById('body').value = unescape(body);

    document.getElementById('form-title').innerText = 'Edit Post';
    document.getElementById('save-btn').innerText = 'Update Post';
    document.getElementById('cancel-btn').style.display = 'inline-block';
}

function resetForm() {
    document.getElementById('post-id').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('body').value = '';

    document.getElementById('form-title').innerText = 'Create New Post';
    document.getElementById('save-btn').innerText = 'Publish Post';
    document.getElementById('cancel-btn').style.display = 'none';
}

function escape(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function unescape(str) {
    return str.replace(/\\'/g, "'").replace(/&quot;/g, '"');
}

fetchPosts();