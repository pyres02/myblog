


const express=require('express');

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app=express();

const ejs=require('ejs')
app.set('view engine','ejs');
const db=require('./model/db.js')

// session
var session = require('express-session')
// 持久化
var NedbStore = require('nedb-session-store')( session );
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
  	maxAge:20000000
  },
  // 配置持久化
  store: new NedbStore({
      filename: 'path_to_nedb_persistence_file.db'
    })
}))





// 读取静态资源
app.use('/public',express.static('./public'));
app.use('/views',express.static('./views'));

// 列表
app.get(`/`,(req,res)=>{

	if(req.session.login){
		db.find('mydata','content',{},res,(a)=>{
       var num=a.length/5;
	     if(a.length==0){
	     
	     	res.render('index',{list:a.splice(0,5),val:true,num:num,n:0,show:true,username:req.session.user});
	     }else{
	     
	     	res.render('index',{list:a.splice(0,5),val:false,num:num,n:0,show:true,username:req.session.user});
	     }

		})

	}else{
		db.find('mydata','content',{},res,(a)=>{
	       var num=a.length/5;
	     if(a.length==0){
	     
	     	res.render('index',{list:a.splice(0,5),val:true,num:num,n:0,show:false,username:''});
	     }else{
	     
	     	res.render('index',{list:a.splice(0,5),val:false,num:num,n:0,show:false,username:''});
	     }

		})
	}

	
  
	
})



app.get(`/login`,(req,res)=>{
 
	res.render('login')
})

app.get(`/create`,(req,res)=>{

	res.render('create',{username:req.session.user})
})




// 注册
app.get(`/user`,urlencodedParser,(req,res)=>{
	 var user=req.query.param1;
	 var pass=req.query.pass;
	db.find('mydata','user',{name:user},res,function(res1){
		console.log(res1)
	
		if(res1.length==0){
			if(pass){
				db.insert('mydata','user',{name:user,pass:pass},res,function(){
					res.send({"status":"数据插入成功"})
				})
			}else{
				res.send({"status":"ok"});
			}
			
		}else{
			res.send({"status":"用户名已存在"})
		}
	})
	
})

// 登录
app.get(`/user2`,urlencodedParser,(req,res)=>{
	  var user=req.query.param1;
	  var pass=req.query.pass;	
	db.find('mydata','user',{name:user,pass:pass},res,function(res1){
		console.log(res1)
		// res1得到的是查询之后的数据，数组。
		if(res1.length!==0){
             // 登录成功，sess保存user
               req.session.user=user;
	           req.session.login=true;
			  res.send({"status":"ok"});
			}else{
				res.send({"status":"用户名或密码错误"})
			}
	})
	
})



// 添加数据
app.get(`/insert`,urlencodedParser,(req,res)=>{
	  var title=req.query.title1;
	  var content=req.query.content1;
	  var username=req.query.username;
	 console.log('title='+title);
	console.log('content='+content);
	
	db.insert('mydata','content',{title:title,content:content,username:username},res,function(res1){
				
		res.send({"status":"数据插入成功"})
			
	})
	
})



// 分页
app.get(`/page`,(req,res)=>{

	var n=req.query.n;
	
	

if(req.session.login){
		db.find('mydata','content',{},res,(a)=>{
		 var num=a.length/5;
			if(a.length==0){
				res.render('index',{list:a.splice(n*5,5),val:true,num:num,n:n,show:true,username:req.session.user})
			}else{
				res.render('index',{list:a.splice(n*5,5),val:false,num:num,n:n,show:true,username:req.session.user})
			}
	   })

	}else{
		db.find('mydata','content',{},res,(a)=>{
		 var num=a.length/5;
			if(a.length==0){
				res.render('index',{list:a.splice(n*5,5),val:true,num:num,n:n,show:false,username:''})
			}else{
				res.render('index',{list:a.splice(n*5,5),val:false,num:num,n:n,show:false,username:''})
			}
	   })
	}




})

// 退出
app.get('/quit',(req,res)=>{
	req.session.user=null;
	req.session.login=false;
	res.redirect('http://localhost:8989/')
})


app.listen(8989);


