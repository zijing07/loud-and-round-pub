# 技术

技术文档和代码可以放在这里。

## TODOs
如果你想开发的话，请在以下标题的下一行，加上你的名字。

感谢大家阅读，希望得到你的反馈甚至提交的代码！

## 前端Tasks
所有的前端Task，都不需要后台支持，请直接在 `loud-and-round` 文件夹中运行 `yarn start` 或者 `npm run start`，添加新的页面即可。

1. 文章阅读计时
1. 文章听音填空

### 1. 文章阅读计时
**What To Do**
1. 准备任意500字的英文文字（文章、书籍、新闻节选）
1. 前端功能：
    1. 开始页面：规则介绍（随便写就好，后面再改），开始Button
    1. 点击开始Button，展现文章+结束Button，开始计时
    1. 点击结束Button，显示阅读消耗时长

### 2. 文章听音填空
1. 准备任意音频1min，与Transcript（可以用BBC 6min）
1. 音频也可以大于1min，然后在前端用音频播放器播放 TimeA -> TimeA+60s 的片段 [Ref1](https://stackoverflow.com/questions/45553396/html5-audio-tag-start-and-end-at-position)
1. Transcript必须对应着这1min的内容
1. 从Transcript中，挑出8-10个单词或词组（Word Options）
1. 前端功能：
    1. 页面：播放器，Transcript，Word Options
    1. Transcript中，将Word Options挖空（Blanks）
    1. Word Options，每个Word都是个Button
    1. 流程：点击开始播放，随着播放，用户点击单词，单词依次填入Transcript的Blanks中
    1. 1分钟播放结束后，计算正确得分

## 数据分析Tasks
1. 字典数据处理

### 1. 字典数据处理

**这个功能如果你写完后，想做自己的查词服务也会很方便的！**

1. 在目录 [dict](./dict) 中，有一个 `dict-word.txt`，请在该目录里编写：
    1. 一段脚本（任意语言皆可），脚本如果你想自己保留的话，也可以不上传
    1. 处理后数据（json），或者一个文件夹里，每个单词为一个单独的file
1. 数据处理示例（请忽略Json里没加引号）：

    ```
    Input:

    pluvian (ˈpluːvIən) n 1 a crocodile bird ▷ adj 2 literary rainy

    Output: (WORD_EXPL)

    {
      word: 'pluvian',
      pron: ['ˈpluːvIən'], # 有的单词可能会有多个音标
      expl: [
        {
          type: 'n', # 词性
          defs: [ # 每个单词，在同一个词性下，会有多个解释
            { 
              def: 'a crocodile bird',
              eg: [''] # 有的单词会有一个或者多个例句
            }
          ] 
        },
        {
          type: 'adj',
          defs: [
            {
              def: 'literary rainy',
              eg: null
            }
          ]
        }
      ]
    }
    ```

1. 处理后的文件格式   
    1. 这里我们有两个选择，一个是存储在一整个文件里，像这样：
     ```
     { word1: WORD_EXPL, word2: WORD_EXPL }
     ```
    1. 另外一个选择是，每个文件存储成一个文件，像这样：
      ```
      |- dict/
      |--|--words/
      |--|--|--word1.json
      |--|--|--word2.json
      ```

