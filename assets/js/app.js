
const cl = console.log;

const postForm = document.getElementById("postForm");
const titleCtrl = document.getElementById("title");
const contentCtrl = document.getElementById("content");
const userIdCtrl = document.getElementById("userId");
const cardContainer = document.getElementById("cardContainer");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const baseUrl = `https://jsonplaceholder.typicode.com`;
const postUrl = `${baseUrl}/posts`;

const editPost = (ele) => {
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId",editId);
    let editUrl = `${baseUrl}/posts/${editId}`;

    fetch(editUrl,{
        method: "GET",
        'Content-type': 'Application/json',
        'token': "raw"
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        titleCtrl.value = data.title;
        contentCtrl.value = data.body;
        userIdCtrl.value = data.userId;

        submitBtn.classList.add("d-none");
        updateBtn.classList.remove("d-none");
        window.scrollTo(0,0);
    })
    .catch(cl);
}

const deletePost = (ele) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
          let deleteId = ele.closest(".card").id;
          let deleteUrl = `${baseUrl}/posts/${deleteId}`;
          fetch(deleteUrl,{
             method: "DELETE",
             header: {
                'Content-type': 'Application/json',
                'token': 'post'
             }
          })
          .then(res => {
             return res.json();
          })
          .then(data => {
           //  cl(data);
            document.getElementById(deleteId).remove();
          })
          .catch(cl);

        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}

const templatingPost = (arr) => {
    cardContainer.innerHTML = arr.map(post => {
        return `<div class="card mb-3" id="${post.id}">
                    <div class="card-header">
                      <h4 class="m-0">${post.title}</h4>
                    </div>
                    <div class="card-body">
                       <p class="m-0">${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                      <button class="btn btn-success" onclick="editPost(this)">Edit</button>
                      <button class="btn btn-danger" onclick="deletePost(this)">Delete</button>
                    </div>
                </div>`
    }).join("");
}

const createPost = (obj) => {
    let card = document.createElement("div");
    card.className = `card mb-3`;
    card.id = obj.id;
    card.innerHTML = `<div class="card-header">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-success" onclick="editPost(this)">Edit</button>
                        <button class="btn btn-danger" onclick="deletePost(this)">Delete</button>
                    </div>`;
    cardContainer.prepend(card);                
}

fetch(postUrl,{
   method: "GET",
   header: {
     'Content-type': 'Application/json',
     'token': "raw"
   } 
})
.then(res => {
    return res.json();
})
.then(data => {
    //cl(data)
    templatingPost(data);
})
.catch(cl);

const submitPost = (eve) => {
    eve.preventDefault();
    let obj = {
        title: titleCtrl.value,
        body: contentCtrl.value,
        userId: userIdCtrl.value
    }

    fetch(postUrl,{
        method: "POST",
        header: {
            'Content-type': 'Application/json',
            'token': "raw"
        }
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        cl(data)
        obj.id = data.id;
        createPost(obj);
    })
    .catch(cl);
}

const updatePost = () => {
    let updateobj = {
        title: titleCtrl.value,
        body: contentCtrl.value,
        userId: userIdCtrl.value
    }
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/posts/${updateId}`;

    fetch(updateUrl,{
        method: "PATCH",
        body: JSON.stringify(updateobj),
        header: {
           'Content-type': 'Application/json',
           'token': 'post' 
        },
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        let card = [...document.getElementById(updateId).children];
        card[0].innerHTML = `<h4 class="m-0">${updateobj.title}</h4>`;
        card[1].innerHTML = ` <p class="m-0">${updateobj.body}</p>`;
        updateBtn.classList.add("d-none");
        submitBtn.classList.remove("d-none");
    })
    .catch(cl)
    .finally(() => {
        postForm.reset();
    })
}

postForm.addEventListener("submit",submitPost);
updateBtn.addEventListener("click",updatePost);