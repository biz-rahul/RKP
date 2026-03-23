<!DOCTYPE html><html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ask a Question</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Poppins',sans-serif}

body{
  min-height:100vh;
  background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
  display:flex;
  justify-content:center;
  align-items:center;
  padding:15px;
}

.card{
  width:100%;
  max-width:420px;
  background:rgba(255,255,255,0.08);
  backdrop-filter:blur(25px);
  padding:25px;
  border-radius:20px;
  color:#fff;
  box-shadow:0 25px 60px rgba(0,0,0,0.5);
  animation:fadeIn 0.6s ease;
}

@keyframes fadeIn{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}

h2{text-align:center;margin-bottom:8px}

.subtitle{
  text-align:center;
  font-size:13px;
  opacity:.8;
  margin-bottom:18px
}

input, textarea{
  width:100%;
  margin:10px 0;
  padding:12px;
  border-radius:12px;
  border:none;
  outline:none;
  font-size:14px;
  transition:0.3s;
}

input:focus, textarea:focus{
  transform:scale(1.02);
  box-shadow:0 0 10px rgba(108,92,231,0.6);
}

textarea{height:110px;resize:none}

.contact-box{
  display:none;
  margin-top:10px;
}

button{
  width:100%;
  padding:13px;
  border:none;
  border-radius:12px;
  background:linear-gradient(135deg,#6c5ce7,#a29bfe);
  color:#fff;
  font-weight:bold;
  cursor:pointer;
  transition:0.3s;
}

button:hover{
  transform:scale(1.03);
  background:linear-gradient(135deg,#4b3fd1,#857bff);
}

.note{
  font-size:12px;
  opacity:.75;
  margin-top:10px;
  text-align:center;
}

@media(max-width:480px){
  .card{padding:20px;border-radius:15px}
}
</style></head><body>
<div class="card"><h2>Ask a Question ❓</h2>
<div class="subtitle">Submit your query and receive a response</div><input type="text" id="name" placeholder="Your Name"><textarea id="question" placeholder="Write your question..."></textarea><!-- Contact Input (Required but appears dynamically) --><div class="contact-box" id="contactBox">
  <input type="text" id="contact" placeholder="Enter your Contact (Phone / Instagram / Telegram etc.)">
</div><button onclick="handleSubmit()">Submit Question</button>

<div class="note">Response will be sent to your provided contact.</div></div><script>

const encodedToken="ODUyNDM5OTY5MjpBQUg4Uk5GbzZVZktDcjgxSUM1c1k2Rk8yMGh4QUJTX3VQUQ==";
const encodedChatId="NjI3NzQzMjM1Ng==";

function decode(str){return atob(str)}

function isValidName(name){return name.length>=2}

function showContactBox(){
  const name=document.getElementById('name').value.trim();
  const question=document.getElementById('question').value.trim();

  if(name.length>=2 && question.length>=8){
    document.getElementById('contactBox').style.display='block';
  }
}

// Trigger when user types

document.getElementById('name').addEventListener('input',showContactBox);
document.getElementById('question').addEventListener('input',showContactBox);

function handleSubmit(){
  const name=document.getElementById('name').value.trim();
  const question=document.getElementById('question').value.trim();
  const contact=document.getElementById('contact').value.trim();

  if(!isValidName(name)){
    alert('Enter valid name');
    return;
  }

  if(question.length<8){
    alert('Enter a proper question');
    return;
  }

  if(contact.length<4){
    alert('Contact is required');
    return;
  }

  const finalMessage=`❓ New Question\nFrom: ${name}\nQuestion: ${question}\nContact: ${contact}`;

  const botToken=decode(encodedToken);
  const chatId=decode(encodedChatId);

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:chatId,text:finalMessage})
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.ok){
      alert('Question sent successfully!');
      document.getElementById('name').value='';
      document.getElementById('question').value='';
      document.getElementById('contact').value='';
      document.getElementById('contactBox').style.display='none';
    }else{
      alert('Error sending question');
    }
  })
  .catch(()=>alert('Network error'));
}

</script></body>
</html>
