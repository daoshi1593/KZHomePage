# cs106b 的相关学习

首先是 cs106b 的构成
cs106b 主要教的是 C++中的 abstractions(我也不知道啥意思),感觉是 ADT 和一些算法(主要是 recruitions)
cs106b 里面有配套的 7 个 assignments 和 30 个 lecs,下面主要对他们进行记录
[TOC]

## 第一单元-assignment1(lec1-6)

主要以体验 c++为主,里面有堆栈溢出的实践编程,可以感受 c++程序在 qt 里的编译,链接情况,和 debug 相关
让人联想起了 cmake,以后也许会学
关于 lecs,主要介绍一些 ADT 包括最基础的变量,list,array 到 strlib 库里的 vector,Set,Queue,Maps

## 第二单元-assignment2(lec7-8)

这里就开始了使用 ADT 的训练,最终目的就是完成最终的 BFS 的编写,利用队列,各种 ADT,完成一个海水漫灌的模型,顺带的也介绍了一些基本知识如 BIG o 表示法和如何优化算法,评估算法优劣

## 第三单元-assignment3,assignment4(lec10-14)

这里就开始了递归的训练,先讲基本的递归思想,例子,然后 assignment 要求实现 BFS 的一系列递归问题(难死我了)
在编写递归算法的基础上还要求掌握优化方法(记忆),便面不必须的开支
**这里就需要做一个总结了,DFS 和 BFS 的大总结**
**对于 DFS 来说**
框架为

```c++
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
- index 给东西编序号然后回溯 1.解决组合问题,给出一个集合的所有子集
  2.DFS 迷宫寻路

<span id="Recurisive_all_matters">Recurisive all matters</span> 1.抓住基本盘

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

### assignment 3 : 回溯与 debug 技巧

- 回溯 :constrain sets

#### 关于 DFS 的大讨论:什么时候回溯,什么时候不回溯,函数传参

**matter A:有序组合**

```cpp
Set<string> allEmphasesOfHelper(Vector<string> decisionmade, Vector<string> decisiontomake){
    Set<string> emphasis;
    if (decisiontomake.isEmpty())
        return emphasis;
    else
        {
        Vector<string> tokencopy = decisiontomake;
        //这个copy的位置决定了每一此函数调用内tokencopy只取决于给函数的decisiontomake
        for(int i = 0; i < tokencopy.size(); i++){

            if(isalpha(decisiontomake[0][0])){
                // include lowercase-version of this word
                decisiontomake.remove(0);
                decisionmade += toLowerCase(tokencopy[i]);
                if(decisiontomake.isEmpty())
                    emphasis.add(Vec2Str(decisionmade) + Vec2Str(decisiontomake));
                emphasis += allEmphasesOfHelper(decisionmade, decisiontomake);

                // include uppercase-version of this word
                decisionmade.remove(decisionmade.size() - 1);
                decisionmade += toUpperCase(tokencopy[i]);
                if(decisiontomake.isEmpty()){
                    emphasis.add(Vec2Str(decisionmade) + Vec2Str(decisiontomake));
                }
                emphasis += allEmphasesOfHelper(decisionmade, decisiontomake);
            }
            else{
                decisiontomake.remove(0);
                decisionmade += tokencopy[i];
                if(decisiontomake.isEmpty())
                    emphasis.add(Vec2Str(decisionmade) + Vec2Str(decisiontomake));}
        }
    }
    return emphasis;
}

```

- 给定一串单词输出所有子集(认为大写和小写是两种状态,则与包含,不包含同构),现在这个问题咋解决?要不要回溯?
- 答:仍然是深度优先搜索,递归基本盘,参数为 decisionToMake,decisionMade;
- 然而由于要考虑一串情况(且有序),可以直接循环,每个循环里面是这样的一种情况:包括 Cur,或者不包括 Cur;
- 此情况不用回溯,因为按值传递,每次调用自己的时候是在创造副本,操作副本,在调用结束退回上一级的时候不会影响上一层次的事情,所以是不需要回溯的
- But the point is 什么时候需要回溯
- 答曰:按引用传递和按指针传递时每一次向下会改变参数,且此参数唯一,所以在每一次结束的时候需要回溯,防止这样一种情况:从低层到高层时,高层使用的参数和底层一样,故需要在低层结尾回溯,也就是使参数在这一个调用内不发生改变(按值传递本就是这样的,所以不需要回溯)
  **matter B:constrained subsets**
- 在有限制的条件下排列班次,使 x 最大化

```cpp
Set<Shift> highestValueScheduleFor(const Set<Shift>& shifts, int maxHours) {

    Set<Shift> shiftmade = {};
    Set<Shift> shifttomake = shifts;
    int shiftHours = 0 ;
    cout << shifttomake <<endl <<"-----------------------------------------"<<endl ;
    return highestValueScheduleForhelper(shiftmade,shifttomake,shiftHours,maxHours);
}
int checkShift (const Shift &Cur,const Set<Shift>& shiftmade)
{
    for (Shift s : shiftmade)
    {
        if (overlapsWith(s,Cur))
        {
            return 1;
        }
    }
    return 0;
}
int cal (const Set<Shift> &shiftmade)
{
    int cal = 0;
    for (const Shift &s : shiftmade)
    {
        cal += valueOf(s);
    }
    return cal;
}

Set<Shift> highestValueScheduleForhelper( Set<Shift>& shiftmade,
                                          Set<Shift>& shifttomake,
                                          int &shiftHours,
                                          int &maxHours){

    if (maxHours < 0)
    {
        error("fuck");
    }
    if (maxHours == 0)
    {
        return {};
    }

    //basic cases
    if (shifttomake.isEmpty())
    {
        return shiftmade;
    }

    Set<Shift> UndosetTomake = {};
    Set<Shift> UndosetMade = {};
    int UndoHours = 0;

    Shift Cur = shifttomake.first();

    shifttomake = shifttomake - Cur;
    UndosetTomake = UndosetTomake + Cur ;

    //判断Cur是否是考虑对象
    if (lengthOf(Cur) <= 0){
            error("fuck");
    }
    if (checkShift(Cur,shiftmade)||shiftHours + lengthOf(Cur)>maxHours)
    {
            Set<Shift> without = highestValueScheduleForhelper(shiftmade,shifttomake,shiftHours,maxHours);
            shifttomake = shifttomake + UndosetTomake ;
            return without;
        }

    //Undo 的适合也许得恢复所有的改变.把所有抛弃的Cur放在一个集合里(?
    //exclude
    Set<Shift> MaxValueWithout =highestValueScheduleForhelper(shiftmade,
                                                            shifttomake,
                                                            shiftHours,
                                                            maxHours);

    //include
    shiftmade = shiftmade + Cur ;
    shiftHours = shiftHours + lengthOf(Cur);

    //Undo
    UndoHours = UndoHours + lengthOf(Cur);
    UndosetMade = UndosetMade + Cur ;


    Set<Shift> MaxValueWith = highestValueScheduleForhelper(shiftmade,
                                                         shifttomake,
                                                         shiftHours,
                                                         maxHours);
    //Undo

    shiftmade = shiftmade - UndosetMade;
    shifttomake = shifttomake + UndosetTomake ;
    shiftHours = shiftHours - UndoHours;

    //end
    if (cal(MaxValueWith) >= cal(MaxValueWithout))
    {
        return MaxValueWith;
    }
    else {
        return MaxValueWithout;
    }
}
```

- 限制条件
- 单变量最优化
- 按引用传递:需要回溯(认为回溯与否取决于使用参数生命周期)
- 基本模板 [Recurisive_all_matters](#Recurisive_all_matters)
- BFS 的本质是穷举

**matter C:寻找完美匹配**

```cpp

bool hasPerfectMatching(const Map<string, Set<string>> &possibleLinks, Set<Pair>& matching) {

    if (possibleLinks.isEmpty())
    {
        return true;
    }
    if (possibleLinks.size()%2 == 1)
    {
        return false;
    }

    string Cur = possibleLinks.firstKey();
    if (possibleLinks.get(Cur).isEmpty())
    {
        return false ;
    }
    for (string CurLink:possibleLinks.get(Cur))
    {
        Map<string, Set<string>> possibleLinksc = possibleLinks;
        /*关键变量在这里,这个case不需要回溯,就是因为这个函数本质上只包括一个循环,每个循环的参数都不是同一个参数,所以完全不需要回溯,只在一个循环内进行修改*/
        Pair chosen(Cur,CurLink);
        matching = matching + chosen;
        Set<string> Curs = possibleLinksc.get(Cur);
        Set<string> CurLinks = possibleLinksc.get(CurLink);
        possibleLinksc.remove(Cur);
        possibleLinksc.remove(CurLink);
        //图里面的crud
        for (string Curt:possibleLinksc.keys())
        {
            if (possibleLinksc.get(Curt).contains(CurLink))
            {
                possibleLinksc.put(Curt,possibleLinksc.get(Curt)-CurLink);
            }
            if (possibleLinksc.get(Curt).contains(Cur))
            {
                possibleLinksc.put(Curt,possibleLinksc.get(Curt)-Cur);
            }
        }
        if (hasPerfectMatching(possibleLinksc,matching))
        {
            return true;
        }
        else{
            matching = matching - chosen;
        }

    }
    return false;
}
```

- 两个参数按引用传递,一个图一个 matching,图被 copy,所以图无需回溯,matching 没有被 copy,所以 matching 需要回溯
- 操作图的时候 crud
- copy 每一轮增加开销,直接操作则不增加开销,不过回溯可能不好写

**matter D: maximumMtching**

```cpp
Set<Pair> maximumWeightMatchingRec(const Map<string, Map<string, int>> links, Set<Pair> team) {
    //baseline
    if (links.isEmpty()) {
        return team;
    }

    //create a answer with value
    Map<Set<Pair>, int> possiblePairs = {};
    //select Current
    string person = links.firstKey();

    //consider all maps for Cur
    for (const string & partner : links[person]) {
        //pruning :minus value not considered
        if (links[person][partner] < 0) {
            continue;
        }
        //consider this case(choosen one)
        Pair pair = {person, partner};
        //copy version for graph
        auto backup = links;
        //change for choose
        backup.remove(person);
        backup.remove(partner);
        for (const string & classmate : backup) {
            if (backup[classmate].containsKey(person)) {
                backup[classmate].remove(person);
            }
            if (backup[classmate].containsKey(partner)) {
                backup[classmate].remove(partner);
            }
        }

        Set<Pair> program = maximumWeightMatchingRec(backup, team + pair) + team;
        possiblePairs[program] = cal(links, program);
    }
    //new copy, the same as choose case
    auto backup = links;
    backup.remove(person);
    //not choose case
        //change for not choose
    for (const string & classmate : backup) {
        if (backup[classmate].containsKey(person)) {
            backup[classmate].remove(person);
        }
    }
    //unchoose case
    Set<Pair> program = maximumWeightMatchingRec(backup, team);
    possiblePairs[program] = cal(links, program);

    team = possiblePairs.firstKey();
    //choose the highest case
    for (Set<Pair> combination : possiblePairs) {
        if (possiblePairs[combination] > possiblePairs[team]) {
            team = combination;
        }
    }

    return team;
}
```

- 数据结构的使用:一个图(map),一个 chosen(set)
- 在函数内部开一个记录 set 权值的 map,用来寻觅最大值开销大但是算法方便
- 回溯:不回溯,因为全是 copy

**试修改版本**

```cpp
Set<Pair> maximumWeightMatchingRec(const Map<string, Map<string, int>>& links, Set<Pair>& team) {
    //baseline
    if (links.isEmpty()) {
        return team;
    }

    //select Current
    string person = links.firstKey();

    //consider all maps for Cur
    for (const string & partner : links[person]) {
        //pruning :minus value not considered
        if (links[person][partner] < 0) {
            continue;
        }
        //consider this case(choosen one)
        Pair pair = {person, partner};
        //change for choose
            //copy version
        Map<string, Map<string, int>> backup = links;
        backup.remove(person);
        backup.remove(partner);
        for (const string & classmate : backup) {
            if (backup[classmate].containsKey(person)) {
                backup[classmate].remove(person);
            }
            if (backup[classmate].containsKey(partner)) {
                backup[classmate].remove(partner);
            }
        }
        //method for choose max:change meta data
        Set<Pair> program = maximumWeightMatchingRec(backup, team + pair);
        int weight = cal(links, program);
        if (weight > cal(links, team)) {
            team = program;
        }
    }
    //not choose case
    Map<string, Map<string, int>> backup = links;
    backup.remove(person);
    for (const string & classmate : backup) {
        if (backup[classmate].containsKey(person)) {
            backup[classmate].remove(person);
        }
    }
    //unchoose case
    Set<Pair> program = maximumWeightMatchingRec(backup, team);
    int weight = cal(links, program);
    if (weight > cal(links, team)) {
        team = program;
    }

    return team;
}
```

- if firstkey has x partners ,there are (x+1) cases
- just find the max set for x+1 cases
- trace method: 
    ```cpp
    //choose the set for the heighst value
    helper(Set& A,Graph B){
        do one choose
        for (case:cases){
            pruning ;
            choose ;
            change A ;
            int value = cal(A) ;
            if (cal(current)>value){
                A = current
            }
        }
        unchoose
        int value = cal(A) ;
        if (cal(current) > value){
            A = current
        }
        return A ;
    }
    ```

#### debug 技巧:recursion

- 三种方式:按断点,单步跳过,单步跳入,单步跳出

## 第四单元 object oriental programming

类-------
class 三步走 1.成员变量 2.成员函数 3.构造器
