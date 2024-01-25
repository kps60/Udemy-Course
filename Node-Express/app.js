const express=require('express');
// const bodyParser=require('body-parser');


const app=express();

// app.use((req,res,next)=>{
//     let body='';
//     req.on('end',()=>{
//         const userName=body.split('=')[1];
//         if(userName){
//             req.body={user:userName};
//         }
//         req.next();
//     });
//     req.on('data',(chunk)=>{
//         body+=chunk;
//     });
// })
app.use(express.urlencoded({extended:false}));
// app.use(console.log(username));
// console.log(username);
app.post('/user',(req,res,next)=>{
    res.send('<h1> User : ' + req.body.username + '</h1>')
    
})
app.get('/',(req,res,next)=>{
    res.send('<form action="/user" method="POST"><input type="text" name="username" ><br/><button type="submit">Create User</button></form>')
})

app.listen(5000)

// const http=require('http');
// const server=http.createServer((req,res)=>{
//     console.log('incoming request');
//     console.log(req.method,req.url);
//     if(req.method==='POST'){
//         let body='';
//         req.on('end',()=>{
//             const username=body.split('=')[1];
//             res.end('<h1>'+ username +'</h1>');
//         });
//         req.on('data',(chunk)=>{
//             body+=chunk;
//         });
//     }else{
//         res.setHeader('Content-Type','text/html');
//         res.end('<form method="POST"><input type="text" name="username" ><br/><button type="submit">Create  User</button></form>');
//     }
    
// });

// server.listen(50000);