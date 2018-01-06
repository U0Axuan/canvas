var RADIUS = 8;//小球半径
var MARGIN_TOP = 40;//数字顶距
var MARGIN_LEFT = 30;//首位数字左边距
var WINDOW_WIDTH = 1024;//画布宽
var WINDOW_HEIGHT = 768;//画布高

const endTime = new Date(2016,8,5,24,0,0);//截至时间(月数为0~11)
var curShowTimeSeconds = 0//初始化

//彩色小球暂存数组
var balls = [];
//小球颜色池
const colors = ["#2669a7","#3b78b0","#5187b9","#6796c1","#7da5ca","#92b4d3","#bdd2e4","#e9f0f6"]

window.onload = function(){
	//屏幕自适应
	WINDOW_WIDTH = document.documentElement.clientWidth-10;//获得宽度
	WINDOW_HEIGHT = document.documentElement.clientHeight-20;//获得高度

	MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1;

	MARGIN_TOP = Math.round(WINDOW_HEIGHT /8);

	//定义
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds()
	
	//动画生成结构
	setInterval(
		function(){//匿名函数，每一帧的动作
			render( context );
			update();//数据更新
		}
		,
		50//执行动作的间隔（毫秒）
	);
}

//获得差距时间
function getCurrentShowTimeSeconds() {
	var curTime = new Date();//获得当前时间
	var ret = endTime.getTime() - curTime.getTime();//计算时间差
	ret = Math.round( ret/1000 )//毫秒换算为秒

	return ret >= 0 ? ret : 0;//判断、返回
}

//动画数据更新
function update(){

	var nextShowTimeSeconds = getCurrentShowTimeSeconds();//将当前帧赋值给“下一帧”

	var nextHours = parseInt( nextShowTimeSeconds / 3600);
	var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
	var nextSeconds = nextShowTimeSeconds % 60

	var curHours = parseInt( curShowTimeSeconds / 3600);//正在绘制的帧
	var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 )
	var curSeconds = curShowTimeSeconds % 60

	if( nextSeconds != curSeconds ){//如果绘制帧的秒不等于下一帧的秒
		//添加当前数字上的彩色小球
		if( parseInt(curHours/10) != parseInt(nextHours/10) ){
			addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
		}
		if( parseInt(curHours%10) != parseInt(nextHours%10) ){
			addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
		}

		if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
			addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
		}
		if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
			addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
		}

		if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
			addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
		}
		if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
			addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
		}
		curShowTimeSeconds = nextShowTimeSeconds;//更新
	}

	updateBalls();

	console.log( balls.length);//控制台显示小球数量
}

//更新彩色小球
function updateBalls(){

	for( var i = 0 ; i < balls.length ; i ++ ){

		//小球初速度
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		//底部碰撞检测
		if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			balls[i].vy = - balls[i].vy*0.7;
		}
	}

	var cnt = 0//画布内的小球数量
	for( var i = 0 ; i < balls.length ; i ++ )
		if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )//如果小球还在画布上
			balls[cnt++] = balls[i]
	//踢出未被显示的小球
	while( balls.length > Math.min(300,cnt) ){
		balls.pop();
	}
}

//添加彩色小球
function addBalls( x , y , num ){

	for( var i = 0  ; i < digit[num].length ; i ++ )
		for( var j = 0  ; j < digit[num][i].length ; j ++ )
			if( digit[num][i][j] == 1 ){
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),//x位置
					y:y+i*2*(RADIUS+1)+(RADIUS+1),//y位置
					g:1.5+Math.random(),//加速度
					vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,//x速度
					vy:-4+Math.random(),//y速度
					color: colors[ Math.floor( Math.random()*colors.length ) ]
				}

				balls.push( aBall )
			}
}

//绘制
function render(cxt){

	cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);//刷新屏幕

	var hours = parseInt( curShowTimeSeconds / 3600);//时
	var minutes = parseInt( (curShowTimeSeconds - hours * 3600)/60 );//分
	var seconds = curShowTimeSeconds % 60;//秒

	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt );//横，纵，要绘制的数字，绘制参数
	renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt );//时第二位
	renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cxt );//冒号
	renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);//分第一位
	renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);//分第二位
	renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);//冒号
	renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);//秒第一位
	renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);//秒第二位

	//绘制彩色小球
	for( var i = 0 ; i < balls.length ; i ++ ){
		cxt.fillStyle=balls[i].color;//随机选取颜色

		cxt.beginPath();
		cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );//画圆
		cxt.closePath();

		cxt.fill();//填充
	}
}

//绘制单个数字
function renderDigit(x,y,num,cxt){

	cxt.fillStyle = "rgb(36,101,162)";

	for( var i = 0 ; i < digit[num].length ; i ++ )
		for(var j = 0 ; j < digit[num][i].length ; j ++ )
			if( digit[num][i][j] == 1 ){
				cxt.beginPath();
				cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
				cxt.closePath()

				cxt.fill()
			}
}
