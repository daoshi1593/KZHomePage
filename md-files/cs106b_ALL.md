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

这里就开始了递归的训练,先讲基本的递归思想,例子,然后 assignment 要求实现 BFS 的一系列递归问题(难)
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
**matter E:wrong cases,minimum cover**
```cpp
bool canBeMadeDisasterReady(const Map<string, Set<string>>& roadNetwork,
                            int numCities,
                            Set<string>& supplyLocations) {
    //baseline
    if (numCities<0){
        error("s");
    }
    if (supplyLocations.size()>numCities){
        return false ;
    }
    if(supplyLocations.size() <= numCities && roadNetwork.isEmpty()){
        return true ;
    }
    string city = roadNetwork.firstKey();
    Set<string> Cur = roadNetwork[city];
    Cur.add(city);
    Map<string, Set<string>> copygraph = roadNetwork;
    for (string cover:Cur){
        Map<string, Set<string>> copy = roadNetwork;
        supplyLocations.add(cover);
        if (supplyLocations.size()>numCities){
            supplyLocations.remove(cover);
            continue ;
        }
        for (string coverd:copygraph[cover]){
            copy.remove(coverd);
        }
        copy.remove(cover);
        if (canBeMadeDisasterReady(copy,numCities,supplyLocations)){
        }else{
            supplyLocations.remove(cover) ;
            continue ;
        }
    }
    return false ;
}
```
wrong :stack overflow,more precise,change procedure is wrong
reason :repeat covering by one specific city :wq
**correct answer**
```cpp
//helper function must be there
//separate args and calls 
bool canBeMadeDisasterReady(const Map<string, Set<string>>& roadNetwork,
                            int numCities,
                            Set<string>& supplyLocation){
                            //call error
    if (numCities < 0) {
        error("num of supplied city less than 0");
    }
    Set<string> remaining;
    for (string city : roadNetwork) {
        remaining += city;
    }
    //remaining contains all citys
    return helper(roadNetwork, numCities, supplyLocations, remaining);
}
//helper function
//4 args 
bool helper(const Map<string, Set<string>> & roadNetwork,
            int numCitys,
            Set<string>& supplyLocations,
            Set<string>& remaining) {
    if (numCitys < 0) {
        return false;
    }
    if (remaining.isEmpty() && numCitys >= 0) {
        return true;
    }
    //there are only two cases
    // case 1:
    // choose one of the remaining to supplyLocations
    string choose = remaining.first();
    Set<string> neighbors = roadNetwork[choose];
    Set<string> left = remaining - choose - neighbors;
    supplyLocations += choose;     // choose
    if (helper(roadNetwork, numCitys - 1, supplyLocations, left)) {  // explore
        return true;
    }
    //back
    supplyLocations -= choose;  // unchoose

    // case 2: choose one of the remaining's neighbor to supplyLocations
    for (string neighbor : neighbors) {
        //neighbor will be covered
        //neighborsOfneighbor is citys coverd by neighbor
        Set<string> neighborsOfNeighbor = roadNetwork[neighbor];
        //left is a set about citys uncoverd
        Set<string> left = remaining - neighborsOfNeighbor - neighbor;
        supplyLocations += neighbor;
        //inplement by decreasing numCitys
        if (helper(roadNetwork, numCitys - 1, supplyLocations, left)) {
            return true;
        }
        //back
        supplyLocations -= ne ighbor;
    }
    return false;
}
```

**try correct version** 
* avoid repeating
(1 test fail)
```cpp
//TODO:fix
bool canBeMadeDisasterReady(const Map<string, Set<string>>& roadNetwork,
                            int numCities,
                            Set<string>& supplyLocations) {
    //baseline
    if (numCities < 0){
        error("s");
    }
    if (supplyLocations.size() > numCities ){
        return false ;
    }
    if(supplyLocations.size() <= numCities && roadNetwork.isEmpty()){
        return true ;
    }
    //choose current
    string city = roadNetwork.firstKey();
    Set<string> Cur = roadNetwork[city];
    Cur.add(city);

    for (string cover:Cur){
        if (supplyLocations.contains(cover)){
            continue ;
        }
        //copy
        Map<string, Set<string>> copy = roadNetwork;
        supplyLocations.add(cover);

        //pruning
        if (supplyLocations.size() > numCities){
            supplyLocations.remove(cover);
            continue ;
        }
        //change
        for (string coverd:roadNetwork[cover]+cover){
            for (string curt:copy.keys()){
                if (copy[curt].contains(coverd)){
                    copy[curt].remove(coverd);
                }
            }
            copy.remove(coverd);
        }
        copy.remove(cover);
        //recursion
        if (canBeMadeDisasterReady(copy,numCities,supplyLocations)){
            return true ;
        }else{
            supplyLocations.remove(cover) ;
            continue ;
        }
    }
    return false ;
}
```
#### Big-O,merge sort
![BIg-O,merge sort](../graph_bed/merge_sort_BIG_O.png)
```cpp
Vector<DataPoint> combineTwo(Vector<DataPoint>A,Vector<DataPoint>B){
    Vector<DataPoint> C = {} ;
    int num1 = A.size();
    int num2 = B.size();
    if (num1 == 0 && num2 == 0){
        return C;
    }
    if (num1 == 0){
        C = B ;
        return C ;
    }
    if (num2 == 0){
        C = A ;
        return C ;
    }
    for (int i = 0;i < num1 + num2;i++){
        if (A.isEmpty()){
            C.add(B.get(0)) ;
            B.remove(0);
            continue ;
        }
        if (B.isEmpty()){
            C.add(A.get(0)) ;
            A.remove(0);
            continue ;
        }
        if (A.get(0).weight <= B.get(0).weight){
            C.add(A.get(0));
            A.remove(0);
            continue ;
        }else {
            C.add(B.get(0));
            B.remove(0) ;
            continue;
        }
    }
    return C ;
}
Vector<DataPoint> combine(const Vector<Vector<DataPoint>>& sequences) {
    //spilt copy
    Vector<DataPoint> C = {};
    int num = sequences.size() ;
    if (num == 1){
        return sequences.get(0);
    }
    if(num == 0){
        return C ;
    }
    if (num % 2 == 0){
        Vector<Vector<DataPoint>> spilt1 = sequences.subList(0,num/2);
        Vector<Vector<DataPoint>> spilt2 = sequences.subList(num/2,num/2);
        Vector<DataPoint> ans1 = combine(spilt1);
        Vector<DataPoint> ans2 = combine(spilt2);
        Vector<DataPoint> ans = combineTwo(ans1,ans2);
        return ans;
    }
    if (num % 2 == 1){
    Vector<Vector<DataPoint>> spilt1 = sequences.subList(0,(num-1)/2);
    Vector<Vector<DataPoint>> spilt2 = sequences.subList((num-1)/2,(num-1)/2);
    Vector<DataPoint> ans1 = combine(spilt1);
    Vector<DataPoint> ans2 = combine(spilt2);
    Vector<DataPoint> ans3 = combineTwo(ans1,ans2);
    Vector<DataPoint> ans4 = sequences.get(num - 1) ;
    Vector<DataPoint> ans = combineTwo(ans3,ans4);
    return ans ;
    }
    return C ;
}
```
* combineTwo is to make two vector sorted
* combine is a recursion to get vectors combined to a huge sorted vector
* shorts : cause the 'A.remove(0)',time wasted

**improvements: from tail to head**
```cpp
Vector<DataPoint> combineTwo(Vector<DataPoint>A,Vector<DataPoint>B){
    Vector<DataPoint> C = {} ;
    int num1 = A.size();
    int num2 = B.size();
    if (num1 == 0 && num2 == 0){
        return C;
    }
    if (num1 == 0){
        C = B ;
        return C ;
    }
    if (num2 == 0){
        C = A ;
        return C ;
    }
    for (int i = 0;i < num1 + num2;i++){
        int numA = A.size() - 1;
        int numB = B.size() - 1;
        if (A.isEmpty()){
            C.add(B.get(numB));
            B.remove(numB );
            continue;
        }
        if (B.isEmpty()){
            C.add(A.get(numA));
            A.remove(numA);
            continue ;
        }
        if (A.get(numA).weight >= B.get(numB).weight){
            C.add(A.get(numA));
            A.remove(numA);
            continue ;
        }else {
            C.add(B.get(numB));
            B.remove(numB);
            continue;
        }
    }
    Vector<DataPoint> D = {};
    while (C.size()>0){
        D.add(C.get(C.size()-1));
        C.remove(C.size() - 1);
    }
    return D ;
}
```
* from the tail to head to remove, faster
* wonderful

**algorithm graph**
![runing time](../graph_bed/merge_sort_time.png)
`
O(nlogk)
`
#### debug 技巧:recursion
- 三种方式:按断点,单步跳过,单步跳入,单步跳出
- (如果代码出错)运行run时程序会直接崩溃(无法debug),debug会停在崩溃的位置
## 第四单元 object oriental programming
**类**
class 三步走 1.成员变量 2.成员函数 3.构造器
### 内存管理与debug
**exploreArrays**
```cpp
void exploreArrays() {
    /* In this section, you'll see how to use the debugger to read the contents
     * of arrays in memory and how to recognize when you're trying to read past
     * the end of an array.
     *
     * Begin by setting a breakpoint on the line of code shown below, then doing
     * execute the "Step Over" command until you're at the next comment.
     */
    DataPoint* elems = new DataPoint[4] {
        { "What",      1 },
        { "a",         2 },
        { "wonderful", 3 },
        { "world!",    4 },
    };

    /* At this point, you now have a nice array of elements in memory. If you
     * try using the debugger to read that array, though, you'll probably only
     * see the first element of that array.
     *
     * To fix this, we'll need to tell the debugger to change the display
     * format for elems. To do so, right-click on "elems" in the debugging
     * window that shows local variable values. You should see two groups of
     * options in the menu. One group be marked "Change Display for Object
     * Named local.elems," and the other will be marked "Change Display for
     * Type DataPoint*." In the group for "Object Named local.elems," choose
     * the option "Array of 10 items." When you do, you should see ten drop-
     * down slots appear underneath elems.
     *
     * Expand out slots [0], [1], [2], and [3] and confirm that you can read
     * the values there and that they match what was created in the array
     * above. You should see the data and weight fields. (You'll also see
     * one called _initializationFlag. This is something extra we added for
     * this assignment to make it easier to spot memory errors, and you can
     * safely ignore it.)
     *
     * Once you've done that, hit "Step Over" to skip this line of code.
     */
    elems[0].weight++; // Just a place for the debugger to rest.

    /* Now, expand out slots [4], [5], [6], ..., and [9]. These slots aren't
     * actually a part of the array, and they're essentially garbage values
     * that appear past the end of the array we allocated up above. Some of
     * the strings you'll see might be marked <not accessible>, while others
     * might be empty, or might be random sequences of symbols. The numbers
     * that you see on the different slots are similarly unpredictable - they
     * might happen to be all zeros, or they might be completely random values
     * with no discernable pattern.
     *
     * Hit "Step Over" to skip this next line and move on to the next section.
     */
    elems[0].weight++; // Just a place for the debugger to rest.

    /* This next section of code allocates space for three DataPoints, but
     * doesn't initialize them. Hit "Step Over" to set that array up.
     *
     * (Yes, we just leaked a bunch of memory. That's not a good thing, but
     * this is purely for educational purposes and so we don't care. ^_^)
     */
    elems = new DataPoint[3];

    /* Now, poke around a bit in the debugger and look at the array contents.
     * Look at slots [0], [1], and [2] (the valid slots in the array.)
     * We didn't initialize any of the elements in this array, so C++ does
     * what it normally does when initializing those elements. In particular,
     * notice that
     *
     * 1. the strings have all been set to the empty string, and
     * 2. the integers are all essentially random.
     *
     * Now, move on and look at slots [3], [4], ..., [9]. Notice that the
     * integers here all look pretty much random as well, but the strings here
     * are likely to be a mix of empty, <not accessible>, and totally random.
     *
     * We wanted you to see this because we want you to understand that seeing
     * garbage values in memory doesn't necessarily mean that you've walked off
     * the end of the array. Rather, it likely means that you're seeing some
     * values in memory that weren't initialized. So don't panic if you see
     * this when writing code that uses arrays - it doesn't mean that your
     * pointer is "bad" or something like that. It could very well mean that
     * you have the space you need, but just forgot to initialize the values
     * there.
     */
    elems[0].weight = 137; // Ah, give a nice value.

    /* To wrap up this section, edit res/ShortAnswers.txt with your answers
     * to the following questions:
     *
     * Q1: What operating system are you using? (Windows, macOS, Linux, etc.)
     *
     * Q2: What are the values you see in elems[3], elems[4], and elems[5]? If
     *     you see garbage strings that run for long periods of time, just give
     *     us the first few characters, or your best approximation of them. :-)
     *
     */
    elems[1].weight = 137; // Just another place for the debugger to chill.
}
```
* the strings have all been set to the empty string, and
* the integers are all essentially random.

**内存泄漏**
* 无指针释放环节

**priority queues**
* head file

```cpp
class HeapPQueue {
public:
    /**
     * Creates a new, empty priority queue.
     */
    HeapPQueue();

    /**
     * Cleans up all memory allocated by this priorty queue. Remember, you're responsible
     * for managing your own memory!
     */
    ~HeapPQueue();

    /**
     * Adds a new data point into the queue. This operation runs in time O(log n),
     * where n is the number of elements in the queue.
     *
     * @param data The data point to add.
     */
    void enqueue(const DataPoint& data);

    /**
     * Removes and returns the lowest-weight data point in the priority queue. If multiple
     * elements are tied for having the loweset weight, any one of them may be returned.
     *
     * If the priority queue is empty, this function calls error() to report an error.
     *
     * This operation must run in time O(log n), where n is the number of elements in the
     * queue.
     *
     * @return The lowest-weight data point in the queue.
     */
    DataPoint dequeue();

    /**
     * Returns, but does not remove, the element that would next be removed via a call to
     * dequeue.
     *
     * If the priority queue is empty, this function calls error() to report an error.
     *
     * This operation must run in time O(1).
     *
     * @return
     */
    DataPoint peek() const;

    /**
     * Returns whether the priority queue is empty.
     *
     * This operation must run in time O(1).
     *
     * @return Whether the priority queue is empty.
     */
    bool isEmpty() const;

    /**
     * Returns the number of data points in this priority queue.
     *
     * This operation must run in time O(1).
     *
     * @return The number of elements in the priority queue.
     */
    int  size() const;

    /* This function exists purely for testing purposes. You can have it do whatever you'd
     * like and we won't be invoking it when grading. In the past, students have had this
     * function print out the array representing the heap, or information about how much
     * space is allocated, etc. Feel free to use it as you see fit!
     */
    void printDebugInfo();

private:
    /* Pointer to the array of elements. Our tests expect your implementation to use the
     * name 'elems' for the pointer to the array of elements, so please do not rename this
     * variable.
     */
    DataPoint* elems = nullptr;

    /* Logical size of the priority queue (the number of elements stored in the heap).
     * Our tests expect that this variable exists, so please do not rename this variable.
     */
    int logicalSize = 0;

    /* Allocated size of the priority queue (the number of slots used in the heap).
     * Our tests expect that this variable exists, so please do not rename this variable.
     */
    int allocatedSize = 0;

    /* Constant controlling how big the original array should be.
     *
     * We've picked this value because it's large enough to hold
     * a small number of elements for when you're just getting
     * started, but small enough that it's easy to test resizing
     * behavior. You shouldn't edit this value.
     */
    static const int INITIAL_SIZE = 6;

    /* TODo: Add any private member variables, member functions, or member
     * types that you'd like. You're welcome to implement this type however
     * you'd like, provided that you do all your own memory management, you
     * don't use any container types (e.g. Vector, HashSet, etc.), and that
     * your implementation uses a binary heap.
     *
     * TODO: Delete this comment before submitting.
     */
    int son1(int index) ;
    int son2(int index);
    int father(int index);
    void expend ();


    /* By default, C++ will let you copy objects. The problem is that the default copy
     * just does an element-by-element copy, which with pointers will give invalid results.
     * This macro disables copying of this type. For more details about how this works, and
     * for more information about how to override the default behavior, take CS106L!
     */
    DISALLOW_COPYING_OF(HeapPQueue);

    /* Grants STUDENT_TEST and PROVIDED_TEST access to the private section of this class.
     * This allows tests to check private fields to make sure they have the right values
     * and to test specific helper functions.
     */
    ALLOW_TEST_ACCESS();
};

```
* inplemention
```cpp
#include "HeapPQueue.h"
using namespace std;

HeapPQueue::HeapPQueue() {
    elems =  new DataPoint[INITIAL_SIZE] ;
    allocatedSize = INITIAL_SIZE ;
    logicalSize = 0 ;
    if (elems != nullptr){
        for (int i=1;i<sizeof(elems);i++){
            elems[i].weight = 0 ;
        }
    }
}

HeapPQueue::~HeapPQueue() {
    /* TODo: Implement this. */
    delete []elems ;
}

int HeapPQueue::size() const {
    return logicalSize ;
}

bool HeapPQueue::isEmpty() const {
    if (logicalSize == 0){
        return true ;
    }
    else {
        return false ;
    }
}

void HeapPQueue::enqueue(const DataPoint& data) {
    /* TODo: Delete the next line and implement this. */
    if (logicalSize == allocatedSize - 1){
        HeapPQueue::expend();
    }
    logicalSize++ ;
    elems[logicalSize] = data ;
    int i = logicalSize ;

    while (father(i) > 0) {
        if (elems[i].weight < elems[father(i)].weight){
            swap(elems[i],elems[father(i)]) ;
            i = father(i);
        }
        else {
            return ;
        }
    }
    return ;
}

DataPoint HeapPQueue::peek() const {
    if (elems == nullptr){
        return {};
    }
    if (logicalSize == 0){
        error("s");
    }
    /* TODo: Delete the next line and implement this. */
    return elems[1] ;
}

DataPoint HeapPQueue::dequeue() {
    if (logicalSize == 0){
        error("s");
    }
    /* TODo: Delete the next line and implement this. */
    if (elems == nullptr){
        return {};
    }
    DataPoint ans = elems[1];
    elems[1] = elems[logicalSize] ;
    logicalSize-- ;
    int son  = 0;
    for(int i = 1;;i = son ){
        if (son1(i) > logicalSize){
            if (son2(i)>logicalSize){
                break ;
            }
            else {
                son = son2(i);
            }
        }
        else {
            if (son2(i)>logicalSize){
                son = son1(i);
            }
            else {
                if (elems[son1(i)].weight < elems[son2(i)].weight){
                    son = son1(i);
                }else {
                    son = son2(i);
                }
            }
        }
        //swap
        if (elems[i].weight > elems[son].weight){
            swap(elems[i],elems[son]) ;
        }
        else {
            return ans;
        }
    }
    return ans;
}
int HeapPQueue::son1(int index) {
    int son1 = 2*index;
    return son1 ;
}
int HeapPQueue::son2(int index){
    int son2 = 2*index + 1 ;
    return son2 ;
}
int HeapPQueue::father(int index)
{
    if (index % 2 == 0){
        return index / 2 ;
    }
    if (index % 2 == 1){
        return (index - 1)/2 ;
    }
    return 0 ;
}
void HeapPQueue::expend (){
    DataPoint * newelems = nullptr ;
    newelems = new DataPoint[2 * allocatedSize];
    if (newelems!=nullptr){
        for (int i=1;i<logicalSize + 1;i++){
            newelems[i] = elems[i];
        }
    }

    delete []elems ;
    elems = newelems ;

    allocatedSize = allocatedSize * 2;
}
```
* the way to store binary heap in array
* bubble ways

**the use for heapPQueue:Apportionment**
try to make it `O(nlogk)`

```cpp
Map<string, int> apportion(const Map<string, int>& populations, int numSeats) {
    /* TOD: Delete this line and the lines below it, then implement this function. */
    if (populations.size()>numSeats){
        error("s") ;
    }
    HeapPQueue condition ;
    HeapPQueue conditioncopy ;
    Map<string, int> ans = {};
    //初始化
    for (string key:populations){
        ans.put(key,1);
    }
    for (string key:populations){
        if (ans[key] == 1){
            DataPoint ans1 = {key,populations[key]/sqrt(2)} ;
            condition.enqueue(ans1) ;
        }
    }
    //分配席位
    for (int num = 0 ; num < numSeats - populations.size() ; num++){
        //分配席位,欺骗状态优先级队列
        DataPoint statet ;
        while (!condition.isEmpty()){
            statet = condition.dequeue();
            conditioncopy.enqueue(statet) ;
        }
        //最高权重name
        string stateName = statet.name ;
        //最高权重新席位数
        int newnum = ans[stateName] + 1 ;
        ans.put(stateName,newnum) ;
        //最高权重人口
        int pop = populations[stateName] ;
        //计算最高权重的新值
        DataPoint newdata = {stateName,pop/sqrt(newnum*(newnum + 1))} ;
        condition.enqueue(newdata) ;
        //从copy中取,重新注入condition
        DataPoint statetcopy ;
        while (!conditioncopy.isEmpty()){
            statetcopy = conditioncopy.dequeue() ;
            if (statetcopy!=statet){
                condition.enqueue(statetcopy) ;
            }
        }
    }
    return ans ;
}

```
超时,重写,很简单,我们打入倒数
```cpp
Map<string, int> apportion(const Map<string, int>& populations, int numSeats) {
    if (populations.size()>numSeats){
        error("s") ;
    }
    HeapPQueue condition ;
    Map<string, int> ans = {};
    //初始化
    for (string key:populations){
        ans.put(key,1);
    }
    for (string key:populations){
        if (ans[key] == 1){
            DataPoint ans1 = {key,sqrt(2)/populations[key]} ;
            condition.enqueue(ans1) ;
        }
    }
    //分配席位
    for (int num = 0 ; num < numSeats - populations.size() ; num++){
        //分配席位,欺骗状态优先级队列
        DataPoint statet ;
        statet = condition.dequeue();

        //最高权重name
        string stateName = statet.name ;
        //最高权重新席位数
        int newnum = ans[stateName] + 1 ;
        ans.put(stateName,newnum) ;
        //最高权重人口
        int pop = populations[stateName] ;
        //计算最高权重的新值
        DataPoint newdata = {stateName,sqrt(newnum*(newnum + 1))/pop} ;
        condition.enqueue(newdata) ;
    }
    return ans ;
}
```
完美通过
## 第五单元-links 
* 链表