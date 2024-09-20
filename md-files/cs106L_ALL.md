# cs106L的相关学习 
## Initialization & References 
```cpp 
#include <iostream>
#include <vector>

void print_vector(const std::vector<int>& vec) {
    for (const int& elem : vec) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;
}

int main() {
    // 初始化示例
    int a(10); // 直接初始化
    int b = 20; // 拷贝初始化
    int c{30}; // 列表初始化

    std::vector<int> vec = {1, 2, 3, 4, 5}; // 列表初始化

    // 引用示例
    int x = 100;
    int& lref = x; // 左值引用
    lref = 200; // 修改 lref 也会修改 x

    int&& rref = 300; // 右值引用
    rref = 400; // 修改 rref

    // 打印结果
    std::cout << "a: " << a << std::endl;
    std::cout << "b: " << b << std::endl;
    std::cout << "c: " << c << std::endl;
    std::cout << "x: " << x << std::endl;
    std::cout << "rref: " << rref << std::endl;

    print_vector(vec);

    return 0;
}
```

## Streams

```cpp 
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

// 从控制台读取用户输入，并将其写入文件
void writeToFile(const std::string& filename) {
    std::ofstream outfile(filename);
    if (!outfile.is_open()) {
        std::cerr << "Unable to open file for writing." << std::endl;
        return;
    }

    std::string input;
    std::cout << "Enter some text (type 'exit' to finish):" << std::endl;
    while (true) {
        std::getline(std::cin, input);
        if (input == "exit") break;
        outfile << input << std::endl;
    }

    outfile.close();
}

// 从文件读取数据，并将其存储到字符串流中
std::string readFromFile(const std::string& filename) {
    std::ifstream infile(filename);
    if (!infile.is_open()) {
        std::cerr << "Unable to open file for reading." << std::endl;
        return "";
    }

    std::ostringstream oss;
    std::string line;
    while (std::getline(infile, line)) {
        oss << line << std::endl;
    }

    infile.close();
    return oss.str();
}

// 处理字符串流中的数据
std::vector<std::string> processStringStream(const std::string& data) {
    std::istringstream iss(data);
    std::vector<std::string> words;
    std::string word;

    while (iss >> word) {
        words.push_back(word);
    }

    return words;
}

int main() {
    const std::string filename = "example.txt";

    // 从控制台读取用户输入，并将其写入文件
    writeToFile(filename);

    // 从文件读取数据，并将其存储到字符串流中
    std::string fileData = readFromFile(filename);

    // 处理字符串流中的数据
    std::vector<std::string> words = processStringStream(fileData);

    // 输出处理结果
    std::cout << "Words in the file:" << std::endl;
    for (const std::string& word : words) {
        std::cout << word << std::endl;
    }

    return 0;
}

```

## Iterators and Pointers

## Introduction to classes
## Container adapters
## InheritancePlan

## Template classes

## Const correctnessPlan

## Template Functions

## Template metaprogramming

## Introduction to Algorithms

## Functions and Lambdas

## Operators and Operator Overloading

## SMFS

## Rule of Zero, Three, and Five

## std::optional

##  RAII

**RAII: Resource Acquisition is Initialization**
RALL for 2 things, locks and memory
[locks](https://en.cppreference.com/w/cpp/thread/lock_guard#:~:text=The%20class%20lock_guard%20is%20a,the%20mutex%20it%20is%20given.)的一些内容
