# algs4 part1

## 连通分量的增加,查找

### Union
数据结构:维护一个树结构 不断将不同树组合,带有判断connected算法

**quick-union1**
union两个联通分量只需把A的root连接到B下 
初始情况下,有n个树,越连接越少
此时的connected()是查询两个节点的根是否相同
```java
import java.util.*;
public class union_and_find {
	//一个数组,id[i]是i的父节点的index

	private int [] id;//id的索引代表对象，id的数组值代表父节点的索引，根节点的索引代表连通分量。
	private int count;//连通分量的个数。

	//正儿八经的创造N个树,使用成员变量跟踪连通分量个数

	public union_and_find(int N){
		//初始化函数，给每个对象赋予
		//一个连通分量（因为此时还没有连接）。
		count = N;
		id = new int[N];
		for (int i=0;i<N;i++) {
			id[i]=i;
		}
	}
	public int count() {//返回连通分量的个数
		return count;
	}
	public boolean connected(int p, int q) {//判断两个对象是否相连
		return (find(p)==find(q));
	}
	//一直追溯直到重复
	public int find(int n) {//寻找某个对象的连通分量
		while(id[n]!=n) {//该对象的根节点的索引对应着该对象的连通分量。
			n=id[n];
		}
		return n;
	}

	//两个函数之一
	public void union(int p, int q) 
		{//执行合并操作,合并操作的前提
		//是两个对象不在同一个连通分量中，也只有这时才会使count-1。
		int p_root = find(p);
		int q_root = find(q);
		//根节点相同则代表在同一个连通分量中。
		if(p_root==q_root) return;

		//执行合并操作,针对的是两个对象的根节点，否则会产生一个对象对应多个根节点的问题。

		id[p_root]=q_root;//

		count--;//执行一次合并操作，连通分量数减一。

	}
	//主函数
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		int N = in.nextInt();//输入对象的个数。
		union_and_find uf = new union_and_find(N);//初始化
		while(in.hasNext()) {//判断是否还有输入，有输入则返回true。
			int p = in.nextInt();
			int q = in.nextInt();
			if (uf.connected(p, q)) continue;
			uf.union(p, q);
			System.out.println(p+" "+q);
		}
		System.out.println(uf.count+" "+"components");
		in.close();
	}
}
```

**quick-union加权**
直接把A的root链接到B下会产生这样一种情况:树不平衡(一端很长,一端很短,然后查找就会费劲)
加权了以后小树插到大树上面
所以只需要关注:小树和大树
```java
import java.util.*;
public class union_and_find {
	private int [] id;//id的索引代表对象，id的数组值代表父节点的索引，根节点的索引代表连通分量。
	private int count;//连通分量的个数。
	private int [] sz;//用于存储每个连通分量的大小（包含对象的个数）
	
	public union_and_find(int N) {//初始化函数，给每个对象赋予
		//一个连通分量（因为此时还没有连接）。
		count = N;
		id = new int[N];
		sz = new int[N];
		for (int i=0;i<N;i++) {
			id[i]=i;
			sz[i]=1;
		}
	}
	public int count() {//返回连通分量的个数
		return count;
	}
	public boolean connected(int p, int q) {//判断两个对象是否相连
		return (find(p)==find(q));
	}
	public int find(int n) {//寻找某个对象的连通分量
		while(id[n]!=n) {//该对象的根节点的索引对应着该对象的连通分量。
			n=id[n];
		}
		return n;
	}
	public void union(int p, int q) {//执行合并操作,合并操作的前提
		//是两个对象不在同一个连通分量中，也只有这时才会使count-1。
		int p_root = find(p);
		int q_root = find(q);
		//根节点相同则代表在同一个连通分量中。
		if(p_root==q_root) return;
		//执行合并操作,针对的是两个对象的根节点，否则会产生一个对象对应多个根节点的问题。

		//小的被插在下面
		if(sz[p_root]<=sz[q_root]) {
			id[p_root]=q_root;
			//执行一次合并操作，连通分量的大小会增加。
			sz[q_root]+=sz[p_root];
		}
		else{
			id[q_root]=p_root;
			sz[p_root]+=sz[q_root];
		}
		//
		count--;//执行一次合并操作，连通分量数减一。
	}
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		int N = in.nextInt();//输入对象的个数。
		union_and_find uf = new union_and_find(N);//初始化
		while(in.hasNext()) {//判断是否还有输入，有输入则返回true。
			int p = in.nextInt();
			int q = in.nextInt();
			if (uf.connected(p, q)) continue;
			uf.union(p, q);
			System.out.println(p+" "+q);
		}
		System.out.println(uf.count+" "+"components");
		in.close();
	}
}
```
![](../graph_bed/algs4_weighted_union.png)

**quick-union-compress-road**
最巧妙的地方,只需要加一行代码
```java
import java.util.*;
public class union_and_find {
	private int [] id;//id的索引代表对象，id的数组值代表父节点的索引，根节点的索引代表连通分量。
	private int count;//连通分量的个数。
	private int [] sz;//用于存储每个连通分量的大小（包含对象的个数）
	
	public union_and_find(int N) {//初始化函数，给每个对象赋予
		//一个连通分量（因为此时还没有连接）。
		count = N;
		id = new int[N];
		sz = new int[N];
		for (int i=0;i<N;i++) {
			id[i]=i;
			sz[i]=1;
		}
	}
	public int count() {//返回连通分量的个数
		return count;
	}
	public boolean connected(int p, int q) {//判断两个对象是否相连
		return (find(p)==find(q));
	}
	public int find(int n) {//寻找某个对象的连通分量
		while(id[n]!=n) {//该对象的根节点的索引对应着该对象的连通分量。

			//父节点变爷爷节点,其实就是把叶子插到上面去,这样所有的树都变成一个根和k-1个叶子			

			//在这里-------------------------------------------------*
			id[n]=id[id[n]];//将祖父节点设为父节点，起到展平树的作用    *
			//在这里-------------------------------------------------*

			n=id[n];
		}
		return n;
	}
	public void union(int p, int q) {//执行合并操作,合并操作的前提
		//是两个对象不在同一个连通分量中，也只有这时才会使count-1。
		int p_root = find(p);
		int q_root = find(q);
		//根节点相同则代表在同一个连通分量中。
		if(p_root==q_root) return;
		//执行合并操作,针对的是两个对象的根节点，否则会产生一个对象对应多个根节点的问题。
		if(sz[p_root]<=sz[q_root]) {
			id[p_root]=q_root;
			//执行一次合并操作，连通分量的大小会增加。
			sz[q_root]+=sz[p_root];
		}
		else{
			id[q_root]=p_root;
			sz[p_root]+=sz[q_root];
		}
		//
		count--;//执行一次合并操作，连通分量数减一。
	}
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		int N = in.nextInt();//输入对象的个数。
		union_and_find uf = new union_and_find(N);//初始化
		while(in.hasNext()) {//判断是否还有输入，有输入则返回true。
			int p = in.nextInt();
			int q = in.nextInt();
			if (uf.connected(p, q)) continue;
			uf.union(p, q);
			System.out.println(p+" "+q);
		}
		System.out.println(uf.count+" "+"components");
		in.close();
	}
}

```

**assignment1**:Percolation
*Percolation.java*
```java
import javax.swing.plaf.synth.Region;
import javax.xml.ws.EndpointReference;

//这个东西就是为了使用快速联合算法
import edu.princeton.cs.algs4.WeightedQuickUnionUF;

public class Percolation {
    private int n;
    private int countOpen = 0;
    private boolean[][] grid;
	//两个
    private WeightedQuickUnionUF uf;
    private WeightedQuickUnionUF uf1;

    // create n-by-n grid, with all sites blocked
    public Percolation(int n)
    {
		//corner case
        if (n < 1)
        {
            throw new java.lang.IllegalArgumentException();
        }
        this.n = n;
        grid = new boolean[n+1][n+1];
        
		//all sites and two virtual sites
        uf = new WeightedQuickUnionUF(n*n + 2); // pdf 58

        //
        uf1 = new WeightedQuickUnionUF(n*n + 1);
    }

    // open site (row, col) if it is not open already
    public void open(int row, int col)
    {
    //corner cases
        if (row < 1 || col < 1 || row > n || col > n)
        {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if(!isOpen(row, col))
        {
        // first row must be connected with virtual1
        if (row == 1)
        {
            uf.union(0, col);
            uf1.union(0, col);
        }
        // last row
        if (row == n)
        {
            uf.union(n * n + 1, (row - 1) * n + col);
        }
        // else, set this site open
        grid[row][col] = true;
        countOpen++;

        System.out.println("*-"+countOpen+"-*");
        System.out.println("*-"+numberOfOpenSites()+"-*");

        ///// and see if its neighbors is full ////

        // left neighbor
        if (col > 1 && isOpen(row, col-1))
        {
            uf.union((row-1) * n + col, (row-1) * n + col - 1);
            uf1.union((row-1) * n + col, (row-1) * n + col - 1);
        }
        // right neighbor
        if (col < n && grid[row][col+1])
        {
            uf.union((row-1) * n + col, (row-1) * n + col + 1);
            uf1.union((row-1) * n + col, (row-1) * n + col + 1);
        }
        // up neighbor
        if (row > 1 && isOpen(row-1, col))
        {
            uf.union((row-1) * n + col, (row-2) * n + col);
            uf1.union((row-1) * n + col, (row-2) * n + col);
        }
        // down neighbor
        if (row < n && isOpen(row+1, col))
        {
            uf.union((row-1) * n + col, row * n + col);
            uf1.union((row-1) * n + col, row * n + col);
        }
        }
    }

    // is site (row, col) open?
    public boolean isOpen(int row, int col)
    {
        if (row < 1 || col < 1 || row > n || col > n)
        {
             throw new java.lang.IndexOutOfBoundsException();
        }

        if (grid[row][col])
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // is site (row, col) full?
    public boolean isFull(int row, int col)
    {
        if (row < 1 || col < 1 || row > n || col > n)
        {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (grid[row][col])
        {
            if (uf1.connected(0, (row-1) * n + col))
            {
                return true;
            }
        }
        return false;
    }

    // number of open sites
    public int numberOfOpenSites()
    {
        return countOpen;
    }

    // does the system percolate?
    public boolean percolates()
    {
        return uf.connected(0, n * n + 1);
    }
    //where s uf1?
}
```
uf是用来检测是否从上到下完成渗透
uf1检测某个地方x,y是否被渗透
```java
if (grid[row][col])
        {
            if (uf1.connected(0, (row-1) * n + col))
            {
                return true;
            }
        }
```

*Percolationstats.java*:蒙特卡洛方法

```java
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdStats;

public class PercolationStats {
    //储存概率
    private double[] results;

    private int count = 0;
    private double mean = 0;
    private double stddev = 0;
    private double confidenceHi = 0;
    private double confidenceLo = 0;
    private Percolation perc;

    // perform trials independent experiments on an n-by-n grid
    public PercolationStats(int n, int trials)  
    {
        if (n <= 0 || trials <= 0)
        {
            throw new java.lang.IllegalArgumentException();
        }

        results = new double[trials];
        //实验开始
        for (int i = 0; i < trials; i++, count = 0){
            //每轮一个实例
            perc = new Percolation(n);
            //增加开放节点直到连通
            while (!perc.percolates())
            {
                //随机开放
                int row = StdRandom.uniform(n)+1;
                int col = StdRandom.uniform(n)+1;
                while (perc.isOpen(row, col))
                {
                    // regenerate random
                    row = StdRandom.uniform(n)+1;
                    col = StdRandom.uniform(n)+1;
                }
                perc.open(row, col);
                count++;
            }
            perc = null;
            results[i] = count/(n * n * 1.0);
        }

        mean = StdStats.mean(results);
        stddev = StdStats.stddev(results);
        confidenceLo = mean - 1.96 * stddev / Math.sqrt(trials);
        confidenceHi = mean + 1.96 * stddev / Math.sqrt(trials);
    }

    // sample mean of peration threshold
    public double mean()
    {
        return mean;
    }

    // sample standard deviation of percolation threshold
    public double stddev()
    {
        return stddev;
    }

    // low  endpoint of 95% confidence interval
    public double confidenceLo()
    {
        return confidenceLo;
    }

    // high endpoint of 95% confidence interval
    public double confidenceHi()
    {
        return confidenceHi;
    }

    public static void main(String[] args)
    {
        int n = Integer.parseInt(args[0]);
        int trials = Integer.parseInt(args[1]);

        PercolationStats stats = new PercolationStats(n, trials);

        System.out.println("mean\t= " + stats.mean());
        System.out.println("stddev\t= " + stats.stddev());
        System.out.println("95% confidence interval = [" + stats.confidenceLo() + ", " + stats.confidenceHi() + "]");
    }
}
```

转:tea/二分/coursera teas
