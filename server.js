const express = require('express');
const fs = require('fs');

const app = express();
const port = 8888;

//파싱미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//파일 초기화
const temp = {};
fs.writeFileSync('position.json', JSON.stringify(temp));
fs.writeFileSync('nav.json', JSON.stringify(temp));
fs.writeFileSync('bool.json', JSON.stringify(temp));

//클라이언트 -> 서버
app.post('/client2server', (req, res) => {
  temp[req.body.ID] = req.body.position;
  fs.writeFileSync('position.json', JSON.stringify(temp));
  res.send('위치 정보 값 받음');
});


//서버 -> 센터
app.post('/server2center', (req, res) => {
  const temp = fs.readFileSync('position.json');
  res.send(temp.toString());
});

//센터 -> 서버
app.post('/center2server', (req, res) => {
  fs.writeFileSync('nav.json', JSON.stringify(req.body));
  res.send('네비게이션 파일 갱신됨');
});

//서버-> 클라이언트
app.post('/server2client', (req, res) => {
  const temp = fs.readFileSync('nav.json');
  res.send(temp.toString());
});
   
//홀로렌즈 -> 웹 영상
app.get('/cam1', (req, res) => {
  res.redirect('https://192.168.0.39/api/holographic/stream/live_high.mp4?holo=true&pv=true&mic=true&loopback=true&RenderFromCamera=true');
});

app.post('/bool2server', (req, res) =>{
  fs.writeFileSync('bool.json', JSON.stringify(req.body));
  res.send('is_happening');
});

app.post('/bool2client', (req, res) =>{
  const temp = fs.readFileSync('bool.json');
  res.send(temp.toString());
});

//README
app.get('/', (req, res) => {
  res.render('cam.html');
});
//run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});