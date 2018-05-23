import './index.scss';
import axios from 'axios';


const postAPI = axios.create({
  baseURL: process.env.API_URL
})


const templates = {
  postList : document.querySelector('#post-list').content,

  // postList : document.importNode(document.querySelector('#post-list').content, true) ==> not active. cause: if do that, JS copy temlplate only one time and also stop or stuck to render for cloning

  postItem : document.querySelector('#post-item').content,
  root : document.querySelector('.root'),
  postContent: document.querySelector("#post-content").content
  ,login: document.querySelector("#login").content
  ,postForm: document.querySelector("#post-form").content
}




function login(res) {
let token;
  if(localStorage.getItem('token')) {
    token = localStorage.getItem('token')
    postAPI.defaults.headers['Authorization'] = `Bearer ${token}`
    templates.root.classList.add('root--authed')
  } else if (res){
  localStorage.setItem('token', res.data.token)
  token = localStorage.getItem('token')
  postAPI.defaults.headers['Authorization'] = `Bearer ${token}`
  templates.root.classList.add('root--authed')
  }
}

function logout(){
  delete postAPI.defaults.headers['Authorization']
  localStorage.removeItem('token')
  templates.root.classList.remove('root--authed')
}


function render(fragment) {
  templates.root.textContent = ""; 
  templates.root.appendChild(fragment);
}


//------------------------------------------------------------


 async function indexPage() {
  
   const res = await postAPI.get('./posts')
   const listFragment = document.importNode(templates.postList, true)
   

   listFragment.querySelector('.post-list__login-btn').addEventListener("click", e => {
     e.preventDefault();
     loginPage()
   })


   listFragment.querySelector('.post-list__logout-btn').addEventListener("click", e => {
     logout()
    // delete postAPI.defaults.headers['Authorization']
    // localStorage.removeItem('token')
    // templates.root.classList.remove('root--authed')
    indexPage()
  })

  listFragment.querySelector('.post-list__new-post-btn').addEventListener("click", e => {
    postFormPage()
  })


  
   res.data.forEach(post => {
     const fragment = document.importNode(templates.postItem, true)
     const pEl = fragment.querySelector('.post-item__title');
     pEl.textContent = post.title;
     pEl.addEventListener("click", e => {
       postContentPage(post.id)
     })
     listFragment.querySelector('.post-list').appendChild(fragment);
     })

     render(listFragment)
}


//--------------------------------------------------------------


async function postContentPage(postId) {
  const res = await postAPI.get(`./posts/${postId}`)
  const fragment = document.importNode(templates.postContent, true)
  fragment.querySelector('.post-content__title').textContent = res.data.title
  fragment.querySelector('.post-content__body').textContent = res.data.body

  fragment.querySelector('.goBack').addEventListener("click", e => {
    indexPage()
  })

render(fragment)
}


//-----------------------------------------------------------


async function loginPage() {
const fragment = document.importNode(templates.login, true)

fragment.querySelector('.goBack').addEventListener("click",  e => {
  e.preventDefault();
  indexPage()
})

const formEl = fragment.querySelector('.login__form')
formEl.addEventListener("submit", async e => {
const payload = {
  username : e.target.elements.username.value,
  password: e.target.elements.password.value
}

e.preventDefault()

const res = await postAPI.post('./users/login', payload)

login(res)
// localStorage.setItem('token', res.data.token)
// postAPI.defaults.headers['Authorization'] = `Bearer ${res.data.token}`
// templates.root.classList.add('root--authed')
indexPage();
})

render(fragment)
}


//----------------------------------------------------------------------

async function postFormPage() {
  const fragment = document.importNode(templates.postForm, true)

  const formEl = fragment.querySelector('.post-form')

  // const usernameSet = await postAPI.get('/users')


  formEl.addEventListener("submit", async e => {
  const payload = {
    title : e.target.elements.title.value,
    body: e.target.elements.body.value,
    username: 'blank'
  }
  
  e.preventDefault()
  
  const res = await postAPI.post('./posts', payload)
  console.log(res)
  postContentPage(res.data.id)
})

fragment.querySelector('.post-form__back').addEventListener("click",  e => {
  e.preventDefault()
  indexPage()
})


render(fragment)
}



//--------------------------------------------------------------------

login()
indexPage()




// document.querySelector('h1').addEventListener('click', e => {
//   alert('Hello World!');
// });
