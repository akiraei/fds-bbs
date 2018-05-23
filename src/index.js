import './index.scss';
import axios from 'axios';


const postAPI = axios.create({})


const templates = {
  postList : document.querySelector('#post-list').content,

  // postList : document.importNode(document.querySelector('#post-list').content, true) ==> not active. cause: if do that, JS copy temlplate only one time and also stop or stuck to render for cloning

  postItem : document.querySelector('#post-item').content,
  root : document.querySelector('.root'),
  postContent: document.querySelector("#post-content").content
  ,login: document.querySelector("#login").content
}



function render(fragment) {
  templates.root.textContent = ""; 
  templates.root.appendChild(fragment);
}



 async function indexPage() {
  
   const res = await postAPI.get('http://localhost:3000/posts')
   const listFragment = document.importNode(templates.postList, true)
   

   listFragment.querySelector('.post-list__login-btn').addEventListener("click", e => {
     loginPage()
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

async function postContentPage(postId) {
  const res = await postAPI.get(`http://localhost:3000/posts/${postId}`)
  const fragment = document.importNode(templates.postContent, true)
  fragment.querySelector('.post-content__title').textContent = res.data.title
  fragment.querySelector('.post-content__body').textContent = res.data.body






  fragment.querySelector('.goBack').addEventListener("click", e => {
    indexPage()
  })

render(fragment)
}



async function loginPage() {
const fragment = document.importNode(templates.login, true)

fragment.querySelector('.goBack').addEventListener("click",  e => {
  indexPage()
})


const formEl = fragment.querySelector('.login__form')
formEl.addEventListener("submit", async e => {
const payload = {
  username : e.target.elements.username.value,
  password: e.target.elements.password.value
}

e.preventDefault()

const res = await postAPI.post('http://localhost:3000/users/login', payload)

console.log(res.data)
localStorage.setItem('token', res.data.token)
postAPI.defaults.headers['Authorization']
indexPage();
})

render(fragment)
}




indexPage()




// document.querySelector('h1').addEventListener('click', e => {
//   alert('Hello World!');
// });
