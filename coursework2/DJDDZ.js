var DJDDZ={};
DJDDZ.Init=function(canvasID){
    JFunction.PreLoadData(GMain.URL).done(function () {
        JMain.JForm=new JControls.Form(GMain.Size,canvasID).setBGImage(ResourceData.Images.bg1);
        JMain.JForm.clearControls();
        GMain.BtnPanel=new JControls.Object({x:100,y:280},{width:600,height:50});//用于显示游戏控制按钮
        GMain.PokerPanel0=new GControls.PokerPanel({x:100,y:5},{width:600,height:120},0,0);//用于显示底牌，显示对象存储在GMain.Poker[0]
        GMain.PokerPanel1=new GControls.PokerPanel({x:200,y:355},{width:400,height:120},1,20);//用于显示自己的牌，显示对象存储在GMain.Poker[1]
        GMain.PokerPanel2=new GControls.PokerPanel({x:695,y:60},{width:100,height:440},2,25);//用于显示右边电脑的牌，显示对象存储在GMain.Poker[2]
        GMain.PokerPanel3=new GControls.PokerPanel({x:5,y:60},{width:100,height:440},3,25);//用于显示左边电脑的牌，显示对象存储在GMain.Poker[3]
        GMain.PokerPanel4=new GControls.PokerPanel({x:200,y:150},{width:400,height:120},4,20);//用于显示出的最后一手牌，显示对象存储在GMain.Poker[4]
        var BeginButton=new JControls.Button({x:235,y:0},{width:130,height:50}).setText("开始").setBGImage(ResourceData.Images.btn);
        BeginButton.onClick=function(){
            GMain.BtnPanel.visible=false;
            DJDDZ.Dealing();
        }
        GMain.BtnPanel.addControlInLast([BeginButton]);
        JMain.JForm.addControlInLast([GMain.PokerPanel0,GMain.PokerPanel1
            ,GMain.PokerPanel2,GMain.PokerPanel3,GMain.PokerPanel4,GMain.BtnPanel]);
        DJDDZ.InitGame();
        JMain.JForm.show();
    });
}
DJDDZ.InitGame=function(){
    GMain.Poker=[];
    for(var i=0;i<5;i++)GMain.Poker[i]=[];//初始化扑克对象存储空间
    for(var j=0;j<54;j++)GMain.Poker[0][j]=new GControls.Poker(j+1);//生成扑克对象
    GMain.PokerPanel0.hidePoker=true;//hidePoker为true，显示扑克背面
    GMain.PokerPanel1.hidePoker=false;//hidePoker为false，显示扑克正面
    GMain.PokerPanel2.hidePoker=true;
    GMain.PokerPanel3.hidePoker=true;
    GMain.PokerPanel4.hidePoker=false;
    GMain.PokerPanel1.toSelectPoker=false;
    GMain.PokerPanel0.density=1;//设置扑克牌显示密度
    GMain.ToPlay=false;
    GMain.LastHandPokerType=null;
    GMain.DealingNum=0;
    GMain.DealerNum=JFunction.Random(1,3);
    GMain.BeginNum=GMain.DealerNum;//初始化发牌起始标识
}
DJDDZ.Dealing=function(){//发牌
    if(GMain.DealingHandle)clearTimeout(GMain.DealingHandle);
    if(GMain.DealingNum>=51) {//已发完牌
        GMain.MaxScore=0;
        GMain.GrabTime=0;
        GMain.PokerPanel0.density=105;
        DJDDZ.GrabTheLandlord();//抢地主
    }else{
        if(GMain.DealerNum>3) GMain.DealerNum=1;
        var r=JFunction.Random(0,GMain.Poker[0].length-1);
        GMain.Poker[GMain.DealerNum].splice(GMain.Poker[ GMain.DealerNum].length,0,GMain.Poker[0][r]);
        GMain.Poker[0].splice(r,1);
        GMain.DealingNum++;
        GMain.DealerNum++;
        GMain.DealingHandle=setTimeout(DJDDZ.Dealing, 40);//40毫秒发一张牌
        JMain.JForm.show();
    }
}
DJDDZ.GrabTheLandlord=function(){//抢地主
    if(GMain.GrabTime==3&&GMain.MaxScore==0){//没有人抢地主
        DJDDZ.GameOver();
        return;
    }
    if(GMain.MaxScore==3||(GMain.MaxScore>0&&GMain.GrabTime==3)){//地主已产生
        GMain.DealerNum=GMain.LandlordNum;
        GMain.LastHandNum=0;
        GMain.PokerPanel0.hidePoker=false;
        GMain.Poker[GMain.LandlordNum].splice(GMain.Poker[GMain.LandlordNum].length,0,GMain.Poker[0][2]);
        GMain.Poker[GMain.LandlordNum].splice(GMain.Poker[GMain.LandlordNum].length,0,GMain.Poker[0][1]);
        GMain.Poker[GMain.LandlordNum].splice(GMain.Poker[GMain.LandlordNum].length,0,GMain.Poker[0][0]);
        GMain.ToPlay=true;
        DJDDZ.ToPlay();
        return;
    }
    if(GMain.DealerNum>3) GMain.DealerNum=1;
    if(GMain.DealerNum==1){//自己抢地主
        GMain.BtnPanel.clearControls();
        var Button1=new GControls.GrabButton({x:10,y:0},{width:130,height:50},1).setText("1分").setBGImage(ResourceData.Images.btn);
        var Button2=new GControls.GrabButton({x:160,y:0},{width:130,height:50},2).setText("2分").setBGImage(ResourceData.Images.btn);
        var Button3=new GControls.GrabButton({x:310,y:0},{width:130,height:50},3).setText("3分").setBGImage(ResourceData.Images.btn);
        var Button4=new GControls.GrabButton({x:460,y:0},{width:130,height:50}).setText("不抢").setBGImage(ResourceData.Images.btn);
        GMain.BtnPanel.addControlInLast([Button1,Button2,Button3,Button4]);
        GMain.BtnPanel.visible=true;
        JMain.JForm.show();
    }else{//电脑抢地主
        var r=JFunction.Random(0,3);
        if(r>GMain.MaxScore){
            GMain.MaxScore=r;
            GMain.LandlordNum=GMain.DealerNum;
        }
        GMain.DealerNum++;
        GMain.GrabTime++;
        JMain.JForm.show();
        DJDDZ.GrabTheLandlord();
    }
}
DJDDZ.GameOver=function(){
    GMain.BtnPanel.clearControls();
    var Button=new JControls.Button({x:235,y:0},{width:130,height:50}).setText("重新开始").setBGImage(ResourceData.Images.btn);
    Button.onClick=function(){
        DJDDZ.InitGame();
        GMain.BtnPanel.visible=false;
        DJDDZ.Dealing();
    }
    GMain.BtnPanel.addControlInLast([Button]);//加载重新开始按钮
    //翻开低牌和左右电脑的牌
    GMain.PokerPanel0.hidePoker=false;
    GMain.PokerPanel2.hidePoker=false;
    GMain.PokerPanel3.hidePoker=false;
    GMain.BtnPanel.visible=true;
    JMain.JForm.show();
}
DJDDZ.ToPlay=function(){//出牌
    JMain.JForm.show();
    if(GMain.DealerNum>3) GMain.DealerNum=1;
    if(GMain.LastHandNum==GMain.DealerNum){
        GMain.LastHandNum=0;
    }
    if(GMain.DealerNum==1){//轮到自己出牌
        GMain.BtnPanel.clearControls();
        if(GMain.LastHandNum==2||GMain.LastHandNum==3){//不是该轮第一个出牌，可以选择不出牌
            var Button1=new JControls.Button({x:50,y:0},{width:100,height:50},1).setText("不出").setBGImage(ResourceData.Images.btn);
            Button1.onClick=function(){
                for(var i=GMain.Poker[GMain.DealerNum].length-1;i>=0;i--)
                    GMain.Poker[GMain.DealerNum][i].isSelected=false;
                GMain.DealerNum++;
                GMain.BtnPanel.visible=false;
                DJDDZ.ToPlay();
            }
        }
        var Button2=new JControls.Button({x:250,y:0},{width:100,height:50}).setText("出牌").setBGImage(ResourceData.Images.btn);
        Button2.onClick=function(){
            var _pokerNumbers=[];
            for(var i=GMain.Poker[GMain.DealerNum].length-1;i>=0;i--){
                if(GMain.Poker[GMain.DealerNum][i].isSelected){
                    _pokerNumbers[_pokerNumbers.length]=GMain.Poker[GMain.DealerNum][i].pokerNumber;
                }
            }
            if(DJDDZ.CheckPlayPoker(_pokerNumbers)){//判断选中的牌是否符合规则
                DJDDZ.PlayPoker();//出选中的牌
                GMain.BtnPanel.visible=false;
                GMain.DealerNum++;
                DJDDZ.ToPlay();//下一位出牌
            }else{
                alert("出牌不符合规则，请重新选择！");
            }
        }
        var Button3=new JControls.Button({x:450,y:0},{width:100,height:50}).setText("提示").setBGImage(ResourceData.Images.btn);
        Button3.onClick=function(){
            DJDDZ.AISelectPoker();
            JMain.JForm.show();
        }
        GMain.BtnPanel.addControlInLast([Button1,Button2,Button3]);
        GMain.BtnPanel.visible=true;
        GMain.PokerPanel1.toSelectPoker=true;
        JMain.JForm.show();
    }else{ //电脑出牌
        if(DJDDZ.AISelectPoker()){//电脑AI选牌
            DJDDZ.PlayPoker();//出选中的牌
        }
        GMain.DealerNum++;
        setTimeout(DJDDZ.ToPlay, 1500);//暂停1500毫秒，下一位出牌
    }
DJDDZ.CheckPlayPoker=function(_pokerNumbers){//检查出牌是否符合规则,pokerNumbers从小到大排序
    var pokerType=DJDDZ.GetPokerType(_pokerNumbers);
    if(pokerType==null)return false;//没有获取到牌型
    if(GMain.LastHandNum==0)return true;//如果是该轮首牌，任何牌型都可以
    else{
        //与该轮出的最后一手牌比较
        if(GMain.PokerTypes[pokerType.type].weight>GMain.PokerTypes[GMain.LastHandPokerType.type].weight)return true;//当前牌型可以压前一手牌型
        else if (GMain.PokerTypes[pokerType.type].weight==GMain.PokerTypes[GMain.LastHandPokerType.type].weight){//当前牌型不可以压前一手牌型
            if(pokerType.type==GMain.LastHandPokerType.type&&pokerType.length==GMain.LastHandPokerType.length){//牌型与出牌数都相同
                if(pokerType.num>GMain.LastHandPokerType.num)return true;//数值大的压数值小的
                else return false;
            }else return false;
        }else return false;
    }
};
DJDDZ.SplitPoker=function(__pokerNumbers , chaiNum){//__pokerNumbers已排序，从小到大
    var splitPoker={};
    for(var type in GMain.PokerTypes) splitPoker[type]=[];
    if(chaiNum==null)chaiNum=3;
    if(__pokerNumbers!=null&&__pokerNumbers.length>0){
        var _pokerNumbers=[];
        var i,j;
        for(i=0;i<__pokerNumbers.length;i++) _pokerNumbers[i]=__pokerNumbers[i];//_pokerNumbers从小到大
        if(_pokerNumbers[_pokerNumbers.length-1]==18&&_pokerNumbers[_pokerNumbers.length-2]==17){
            splitPoker["12"].splice(0,0,17);
            _pokerNumbers.length=_pokerNumbers.length-2;
        }
        for(i=chaiNum;i>=0;i--){
            var str="1";
            for(var i1=1;i1<=i;i1++)str=str+String(1);
            for(j=_pokerNumbers.length-1;j>=i;j--){
                if(_pokerNumbers[j]==_pokerNumbers[j-i]){
                    splitPoker[str].splice(0,0,_pokerNumbers[j]);// splitPoker[str]从小到大
                    for(var k=j;k>=j-i;k--){
                        _pokerNumbers.splice(k,1);
                    }
                }
            }
        }
    }
    return splitPoker;
};
DJDDZ.IsStraight=function(numbers){//numbers已排序，从小到大
    for(var i=1;i<numbers.length;i++){
        if(numbers[i]-numbers[i-1]!=1)return false;
    }
    return true;
}