# cs106b的相关学习
&emsp; 首先是cs106b的构成 
&emsp; cs106b主要教的是C++中的abstractions(我也不知道啥意思),感觉是ADT和一些算法(主要是recruitions)
&emsp; cs106b里面有配套的7个assignments和30个lecs,下面主要对他们进行记录
## 第一单元-assignment1(lec1-6)
&emsp;  主要以体验c++为主,里面有堆栈溢出的实践编程,可以感受c++程序在qt里的编译,链接情况,和debug相关 
&emsp;  让人联想起了cmake,以后也许会学
&emsp;  关于lecs,主要介绍一些ADT包括最基础的变量,list,array到strlib库里的vector,Set,Queue,Maps
## 第二单元-assignment2(lec7-8)
&emsp;  这里就开始了使用ADT的训练,最终目的就是完成最终的BFS的编写,利用队列,各种ADT,完成一个海水漫灌的模型,顺带的也介绍了一些基本知识如BIG o表示法和如何优化算法,评估算法优劣
## 第三单元-assignment3(lec10-14)
&emsp;  这里就开始了递归的训练,先讲基本的递归思想,例子,然后assignment要求实现BFS的一系列递归问题(难死我了) 
&emsp;  在编写递归算法的基础上还要求掌握优化方法(记忆),便面不必须的开支
### 这里就需要做一个总结了,DFS和BFS的大总结,我这里学习这类算法是为了运用在项目上
&emsp;  **对于DFS来说**
框架为
```(c++)
void dfs() //参数用来表示状态  
{  
    if(到达终点状态)  
    {  
        ...//根据题意添加  
        return;  
    }  
    if(越界或者是不合法状态)  
        return;  
    if(特殊状态)//剪枝
        return ;
    for(扩展方式)  
    {  
        if(扩展方式所达到状态合法)  
        {  
            修改操作;//根据题意来添加  
            标记；  
            dfs（）；  
            (还原标记)；  
            //是否还原标记根据题意  
            //如果加上（还原标记）就是 回溯法  
        }  
 
    }  
}  
```

### 回溯及其优化
- 探索,取消,体验各种数据结构
- keep track of struct
- index 给东西编序号然后回溯
1.解决组合问题,给出一个集合的所有子集
2.DFS 迷宫寻路
 
Recurisive all matters
1.抓住基本盘
```cpp 
if (a == number)
{
    do the basic case;
    return {basic};
}
if (b < c)
{
    return somecases;
}

/* decisions */

/* decison 1 under A condition */
do the fuck ;

/* decison 2 under A condition */
do the fuck ;

...

/* decision n */
do the fuck ;

/* UNDO */

undo the fuck ;


return what we want;
```